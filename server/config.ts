export const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'ecommerce_db'
};

export const jwtSecret = 'your_jwt_secret_key';

export const elasticConfig = {
  node: 'http://localhost:9200'
};

export const redisConfig = {
  host: 'localhost',
  port: 6379
};

export const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-specific-password'
  }
};