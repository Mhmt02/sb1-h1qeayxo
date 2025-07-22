import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { Client } from '@elastic/elasticsearch';
import Redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import { dbConfig, jwtSecret, elasticConfig, redisConfig, emailConfig } from './config';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Redis client setup
const redisClient = Redis.createClient(redisConfig);
redisClient.connect().catch(console.error);

// Rate limiter setup
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 10, // 10 requests
  duration: 1, // per 1 second
});

// Rate limiting middleware
const rateLimiterMiddleware = async (req: any, res: any, next: any) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ message: 'Too Many Requests' });
  }
};

// Elasticsearch client setup
const esClient = new Client(elasticConfig);

// MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Email transporter
const transporter = nodemailer.createTransport(emailConfig);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    if (file.fieldname === 'banner') {
      uploadPath += 'banners/';
    } else if (file.fieldname === 'product') {
      uploadPath += 'products/';
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Cache middleware
const cacheMiddleware = async (req: any, res: any, next: any) => {
  const key = `cache:${req.originalUrl}`;
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    next();
  } catch (error) {
    next();
  }
};

// Auth middleware
const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token bulunamadı' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Geçersiz token' });
  }
};

// Auth routes
app.post('/api/auth/login', rateLimiterMiddleware, [
  body('username').notEmpty(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const [rows]: any = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Geçersiz şifre' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: '1d' }
    );

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Products routes with search
app.get('/api/products/search', cacheMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    const { body } = await esClient.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query: q,
            fields: ['name', 'description', 'search_keywords']
          }
        }
      }
    });

    const key = `cache:${req.originalUrl}`;
    await redisClient.setEx(key, 3600, JSON.stringify(body.hits.hits));
    
    res.json(body.hits.hits);
  } catch (error) {
    res.status(500).json({ message: 'Arama hatası' });
  }
});

// Product reviews
app.post('/api/products/:id/reviews', authMiddleware, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('review').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    await pool.query(
      'INSERT INTO product_reviews (product_id, user_id, rating, review_text) VALUES (?, ?, ?, ?)',
      [id, userId, rating, review]
    );

    // Update product rating
    await pool.query(`
      UPDATE products p
      SET rating_avg = (
        SELECT AVG(rating)
        FROM product_reviews
        WHERE product_id = ?
      ),
      rating_count = (
        SELECT COUNT(*)
        FROM product_reviews
        WHERE product_id = ?
      )
      WHERE p.id = ?
    `, [id, id, id]);

    res.status(201).json({ message: 'İnceleme eklendi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Coupon routes
app.post('/api/coupons/validate', authMiddleware, async (req, res) => {
  try {
    const { code } = req.body;
    const [rows]: any = await pool.query(`
      SELECT *
      FROM coupons
      WHERE code = ?
        AND NOW() BETWEEN start_date AND end_date
        AND (usage_limit IS NULL OR used_count < usage_limit)
    `, [code]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Geçersiz kupon kodu' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Stock notification
app.post('/api/products/:id/notify', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [user]: any = await pool.query(
      'SELECT email FROM users WHERE id = ?',
      [userId]
    );

    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: user[0].email,
      subject: 'Ürün Stok Bildirimi',
      text: 'İstediğiniz ürün stoka girdiğinde size haber vereceğiz.'
    });

    res.json({ message: 'Bildirim kaydedildi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});