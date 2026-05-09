import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '../services/api.js';

const fallbackImage =
  'https://images.unsplash.com/photo-1501004318641-729e8439a7e7?auto=format&fit=crop&w=800&q=80';

const createEmptyProductForm = (defaultCategoryId = 0) => ({
  productName: '',
  description: '',
  careGuide: '',
  price: '',
  stock: '',
  categoryId: defaultCategoryId,
  currentImage: '',
  imageFile: null,
  active: true,
});

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [productForm, setProductForm] = useState(createEmptyProductForm());

  const isEditing = editingProductId !== null;

  useEffect(() => {
    if (!isModalOpen) {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl('');
      return;
    }

    if (productForm.imageFile) {
      const url = URL.createObjectURL(productForm.imageFile);
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(url);
      return;
    }

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl('');
    }
  }, [imagePreviewUrl, isModalOpen, productForm.imageFile]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const cats = await apiService.getCategories();
        const prods = await apiService.getProducts();
        const catOptions = (cats || [])
          .filter((category) => category?.categoryId != null)
          .map((category) => ({
            categoryId: Number(category.categoryId),
            categoryName: category.categoryName || `#${category.categoryId}`,
          }));

        setCategories(catOptions);

        const categoryNameById = new Map(catOptions.map((category) => [category.categoryId, category.categoryName]));
        const mappedProducts = (prods || [])
          .filter((product) => product?.productId != null)
          .map((product) => ({
            id: String(product.productId),
            name: product.productName || '(Không tên)',
            price: product.price ?? 0,
            stock: product.stock ?? 0,
            image: product.image || undefined,
            categoryId: Number(product.categoryId) || 0,
            category: categoryNameById.get(Number(product.categoryId)) || `#${product.categoryId ?? ''}`,
            active: Boolean(product.active),
          }));

        setProducts(mappedProducts);
        setProductForm((current) => ({
          ...current,
          categoryId: current.categoryId || (catOptions[0]?.categoryId ?? 0),
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách sản phẩm.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const resetProductForm = () => {
    setProductForm(createEmptyProductForm(categories[0]?.categoryId ?? 0));
    setEditingProductId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetProductForm();
  };

  const openAddModal = () => {
    resetProductForm();
    setIsModalOpen(true);
  };

  const openEditModal = async (productId) => {
    try {
      const product = await apiService.request({
        method: 'GET',
        url: `/products/${productId}`,
      });

      setEditingProductId(String(productId));
      setProductForm({
        productName: product.productName || '',
        description: product.description || '',
        careGuide: product.careGuide || '',
        price: product.price ?? '',
        stock: product.stock ?? '',
        categoryId: Number(product.categoryId) || categories[0]?.categoryId || 0,
        currentImage: product.image || '',
        imageFile: null,
        active: Boolean(product.active),
      });
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể tải thông tin sản phẩm.');
    }
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();

    try {
      if (!productForm.categoryId) {
        toast.error('Vui lòng chọn danh mục.');
        return;
      }

      const payload = {
        categoryId: Number(productForm.categoryId),
        productName: productForm.productName,
        description: productForm.description.trim() ? productForm.description : null,
        careGuide: productForm.careGuide.trim() ? productForm.careGuide : null,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        image: productForm.imageFile || (isEditing ? productForm.currentImage || null : null),
        active: Boolean(productForm.active),
      };

      if (!isEditing && !productForm.imageFile) {
        toast.error('Vui lòng tải ảnh từ máy cho sản phẩm mới.');
        return;
      }

      const response = isEditing
        ? await apiService.updateProduct(editingProductId, payload)
        : await apiService.createProduct(payload);

      const categoryId = Number(response.categoryId ?? productForm.categoryId);
      const categoryName = categories.find((category) => category.categoryId === categoryId)?.categoryName || `#${categoryId}`;
      const mappedProduct = {
        id: String(response.productId ?? editingProductId ?? ''),
        name: response.productName || productForm.productName,
        price: response.price ?? Number(productForm.price),
        stock: response.stock ?? Number(productForm.stock),
        image: response.image || productForm.currentImage || undefined,
        categoryId,
        category: categoryName,
        active: Boolean(response.active ?? productForm.active),
      };

      if (isEditing) {
        setProducts((current) =>
          current.map((product) => (product.id === String(editingProductId) ? mappedProduct : product))
        );
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        setProducts((current) => [mappedProduct, ...current]);
        toast.success('Thêm sản phẩm thành công!');
      }

      closeModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : isEditing ? 'Cập nhật sản phẩm thất bại.' : 'Thêm sản phẩm thất bại.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text tracking-tight">Sản phẩm</h1>
          <p className="text-text-muted text-xs md:text-sm font-medium mt-1">Quản lý kho hàng cây cảnh và dụng cụ của bạn.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black shadow-xl shadow-primary/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center space-x-2 w-full sm:w-auto text-sm md:text-base"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Thêm cây cảnh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-surface rounded-[2.5rem] border border-border shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
            <div className="relative aspect-square overflow-hidden bg-slate-50">
              <img
                src={product.image || fallbackImage}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black text-text shadow-sm uppercase tracking-wider">
                  {product.category}
                </span>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-black text-text mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-text-muted text-[10px] font-bold mb-2 uppercase tracking-tighter">Mã: {product.id}</p>
              <p className={`text-[11px] font-bold mb-4 uppercase tracking-wider ${product.active ? 'text-emerald-600' : 'text-rose-500'}`}>
                {product.active ? 'Đang bán' : 'Đang ẩn'}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary font-black text-2xl tracking-tighter">đ{Number(product.price || 0).toLocaleString()}</p>
                  <p className={`text-[11px] font-bold mt-1 ${product.stock < 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    Tồn kho: {product.stock} sản phẩm
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openEditModal(product.id)}
                  className="p-3 bg-slate-50 rounded-2xl text-text-muted hover:bg-primary-light hover:text-primary transition-colors"
                  aria-label={`Chỉnh sửa ${product.name}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 md:p-6">
          <div className="absolute inset-0 bg-text/20 backdrop-blur-md" onClick={closeModal}></div>
          <div className="relative z-10 mx-auto flex min-h-full w-full max-w-3xl items-start justify-center md:items-center">
            <div className="bg-surface flex w-full max-h-[92vh] flex-col rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-black text-text tracking-tight">
                {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button type="button" onClick={closeModal} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmitProduct} className="overflow-y-auto p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Tên sản phẩm</label>
                <input
                  required
                  type="text"
                  value={productForm.productName}
                  onChange={(event) => setProductForm({ ...productForm, productName: event.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                  placeholder="Ví dụ: Cây Tùng Bách..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Mô tả</label>
                <textarea
                  value={productForm.description}
                  onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text min-h-[110px] resize-y"
                  placeholder="Mô tả ngắn về sản phẩm..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Hướng dẫn chăm sóc</label>
                <textarea
                  value={productForm.careGuide}
                  onChange={(event) => setProductForm({ ...productForm, careGuide: event.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text min-h-[110px] resize-y"
                  placeholder="Ánh sáng, tưới nước, đất trồng..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Giá bán (đ)</label>
                  <input
                    required
                    min="0"
                    type="number"
                    value={productForm.price}
                    onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Số lượng</label>
                  <input
                    required
                    min="0"
                    type="number"
                    value={productForm.stock}
                    onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Danh mục</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(event) => setProductForm({ ...productForm, categoryId: Number(event.target.value) })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text appearance-none"
                  >
                    {categories.length === 0 ? (
                      <option value={0}>Chưa có danh mục</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Trạng thái</label>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, active: !productForm.active })}
                    className={`w-full px-5 py-4 rounded-2xl border font-black transition-all ${
                      productForm.active
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : 'bg-rose-50 border-rose-100 text-rose-600'
                    }`}
                    aria-pressed={productForm.active}
                  >
                    {productForm.active ? 'Đang bán (active)' : 'Ẩn (inactive)'}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Ảnh sản phẩm</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="md:col-span-2 space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      required={!isEditing}
                      onChange={(event) => {
                        const file = event.target.files?.[0] || null;
                        setProductForm({ ...productForm, imageFile: file });
                      }}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                    />
                    <p className="text-[10px] font-bold text-text-muted">
                      Chỉ hỗ trợ tải ảnh trực tiếp từ máy. {isEditing ? 'Nếu không chọn file mới sẽ giữ ảnh hiện tại.' : ''}
                    </p>
                  </div>

                  <div className="md:col-span-1">
                    <div className="aspect-square rounded-2xl border border-border bg-slate-50 overflow-hidden">
                      <img
                        src={imagePreviewUrl || productForm.currentImage || fallbackImage}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage;
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-3 rounded-2xl border border-border text-text-muted font-black hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 hover:opacity-90 transition-all"
                >
                  {isEditing ? 'Lưu cập nhật' : 'Xác nhận thêm'}
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
