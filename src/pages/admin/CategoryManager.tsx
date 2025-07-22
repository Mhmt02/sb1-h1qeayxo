import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  level: number;
  productCount?: number;
  children?: Category[];
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent_id: null as number | null,
  });

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    setFlatCategories(storedCategories);
    setCategories(buildCategoryTree(storedCategories));
  }, []);

  const buildCategoryTree = (flatCategories: Category[]): Category[] => {
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    // First pass: create all categories with children arrays
    flatCategories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [], level: 0 });
    });

    // Second pass: build the tree structure
    flatCategories.forEach(cat => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.children!.push(category);
          category.level = parent.level + 1;
        }
      } else {
        rootCategories.push(category);
      }
    });

    return rootCategories;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      ...formData,
      level: formData.parent_id ? 
        (flatCategories.find(c => c.id === formData.parent_id)?.level || 0) + 1 : 0
    };

    if (editingCategory) {
      const updatedCategories = flatCategories.map(category => 
        category.id === editingCategory.id 
          ? { ...category, ...categoryData }
          : category
      );
      setFlatCategories(updatedCategories);
      setCategories(buildCategoryTree(updatedCategories));
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    } else {
      const newCategory = {
        id: Date.now(),
        ...categoryData,
        productCount: 0
      };
      const updatedCategories = [...flatCategories, newCategory];
      setFlatCategories(updatedCategories);
      setCategories(buildCategoryTree(updatedCategories));
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    }

    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', parent_id: null });
  };

  const deleteCategory = (id: number) => {
    const hasChildren = flatCategories.some(cat => cat.parent_id === id);
    if (hasChildren) {
      alert('Bu kategorinin alt kategorileri var. Önce alt kategorileri silin.');
      return;
    }

    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      const updatedCategories = flatCategories.filter(category => category.id !== id);
      setFlatCategories(updatedCategories);
      setCategories(buildCategoryTree(updatedCategories));
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    }
  };

  const editCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      parent_id: category.parent_id || null,
    });
    setIsModalOpen(true);
  };

  const toggleExpanded = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategoryRow = (category: Category) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <React.Fragment key={category.id}>
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center" style={{ paddingLeft: `${category.level * 20}px` }}>
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(category.id)}
                  className="mr-2 p-1 hover:bg-gray-200 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              {!hasChildren && <div className="w-6 mr-2" />}
              <div>
                <div className="text-sm font-medium text-gray-900 flex items-center">
                  {category.level > 0 && (
                    <span className="text-gray-400 mr-2">└─</span>
                  )}
                  {category.name}
                </div>
                <div className="text-xs text-gray-500">
                  Seviye: {category.level + 1}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">{category.slug}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">{category.productCount || 0}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">
              {hasChildren ? `${category.children!.length} alt kategori` : '-'}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
              onClick={() => editCategory(category)}
              className="text-indigo-600 hover:text-indigo-900 mr-4"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={() => deleteCategory(category.id)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </td>
        </tr>
        {hasChildren && isExpanded && category.children!.map(child => renderCategoryRow(child))}
      </React.Fragment>
    );
  };

  const getParentOptions = () => {
    return flatCategories.filter(cat => cat.level < 2); // Maximum 3 level (0, 1, 2)
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kategori Yönetimi</h1>
          <p className="text-gray-600 mt-1">Hiyerarşik kategori yapısı (maksimum 3 seviye)</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', parent_id: null });
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Kategori
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ürün Sayısı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alt Kategoriler
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map(category => renderCategoryRow(category))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Üst Kategori
                </label>
                <select
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    parent_id: e.target.value ? parseInt(e.target.value) : null 
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Ana Kategori</option>
                  {getParentOptions().map((category) => (
                    <option key={category.id} value={category.id}>
                      {'─'.repeat(category.level)} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const slug = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '');
                    setFormData({ 
                      name: e.target.value,
                      slug: slug,
                      parent_id: formData.parent_id
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  required
                  readOnly
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editingCategory ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;