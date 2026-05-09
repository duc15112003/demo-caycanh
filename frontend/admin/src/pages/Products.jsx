import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '../services/api.js';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [newProduct, setNewProduct] = useState({
    productName: '',
    description: '',
    careGuide: '',
    price: '',
    stock: '',
    categoryId: 0,
    imageUrl: '',
    imageFile: null,
    active: true,
  });

  useEffect(() => {
    if (!isModalOpen) {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl('');
      return;
    }

    if (newProduct.imageFile) {
      const url = URL.createObjectURL(newProduct.imageFile);
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(url);
      return;
    }

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl('');
    }
  }, [newProduct.imageFile, isModalOpen]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const cats = await apiService.getCategories();
        const prods = await apiService.getProducts();
        const catOptions = (cats || [])
          .filter((c) => c?.categoryId != null)
          .map((c) => ({ categoryId: Number(c.categoryId), categoryName: c.categoryName || `#${c.categoryId}` }));

        setCategories(catOptions);

        const categoryNameById = new Map(catOptions.map((c) => [c.categoryId, c.categoryName]));
        const mapped = (prods || [])
          .filter((p) => p?.productId != null)
          .map((p) => ({
            id: String(p.productId),
            name: p.productName || '(Không tên)',
            price: p.price ?? 0,
            stock: p.stock ?? 0,
            image: p.image || undefined,
            category: categoryNameById.get(Number(p.categoryId)) || `#${p.categoryId ?? ''}`,
          }));

        setProducts(mapped);

        setNewProduct((prev) => ({
          ...prev,
          categoryId: prev.categoryId || (catOptions[0]?.categoryId ?? 0),
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (!newProduct.categoryId) {
        toast.error('Vui lòng chọn danh mục.');
        return;
      }

      const created = await apiService.createProduct({
        categoryId: Number(newProduct.categoryId),
        productName: newProduct.productName,
        description: newProduct.description.trim() ? newProduct.description : null,
        careGuide: newProduct.careGuide.trim() ? newProduct.careGuide : null,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        image: newProduct.imageFile || (newProduct.imageUrl.trim() ? newProduct.imageUrl.trim() : null),
        active: Boolean(newProduct.active),
      });

      const categoryName = categories.find((c) => c.categoryId === Number(created.categoryId))?.categoryName || `#${created.categoryId ?? ''}`;
      const product = {
        id: String(created.productId ?? ''),
        name: created.productName || newProduct.productName,
        price: created.price ?? Number(newProduct.price),
        stock: created.stock ?? Number(newProduct.stock),
        image: created.image || undefined,
        category: categoryName,
      };

      setProducts([product, ...products]);
      setIsModalOpen(false);
      setNewProduct({
        productName: '',
        description: '',
        careGuide: '',
        price: '',
        stock: '',
        categoryId: categories[0]?.categoryId ?? 0,
        imageUrl: '',
        imageFile: null,
        active: true,
      });
      toast.success('Thêm sản phẩm thành công!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Thêm sản phẩm thất bại.');
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
          onClick={() => setIsModalOpen(true)}
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
                src={product.image || 'https://images.unsplash.com/photo-1501004318641-729e8439a7e7?auto=format&fit=crop&w=800&q=80'}
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
              <p className="text-text-muted text-[10px] font-bold mb-4 uppercase tracking-tighter">Mã: {product.id}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary font-black text-2xl tracking-tighter">đ{product.price.toLocaleString()}</p>
                  <p className={`text-[11px] font-bold mt-1 ${product.stock < 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    Tồn kho: {product.stock} sản phẩm
                  </p>
                </div>
                <button className="p-3 bg-slate-50 rounded-2xl text-text-muted hover:bg-primary-light hover:text-primary transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-text/20 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-surface w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-black text-text tracking-tight">Thêm sản phẩm mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Tên sản phẩm</label>
                <input
                  required
                  type="text"
                  value={newProduct.productName}
                  onChange={e => setNewProduct({...newProduct, productName: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                  placeholder="Ví dụ: Cây Tùng Bách..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Mô tả</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text min-h-[110px] resize-y"
                  placeholder="Mô tả ngắn về sản phẩm..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Hướng dẫn chăm sóc</label>
                <textarea
                  value={newProduct.careGuide}
                  onChange={(e) => setNewProduct({ ...newProduct, careGuide: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text min-h-[110px] resize-y"
                  placeholder="Ánh sáng, tưới nước, đất trồng..."
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Giá bán (đ)</label>
                  <input
                    required
                    type="number"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Số lượng</label>
                  <input
                    required
                    type="number"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Danh mục</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={e => setNewProduct({...newProduct, categoryId: Number(e.target.value)})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text appearance-none"
                  >
                    {categories.length === 0 ? (
                      <option value={0}>Chưa có danh mục</option>
                    ) : (
                      categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>
                          {c.categoryName}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Trạng thái</label>
                  <button
                    type="button"
                    onClick={() => setNewProduct({ ...newProduct, active: !newProduct.active })}
                    className={`w-full px-5 py-4 rounded-2xl border font-black transition-all ${
                      newProduct.active
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : 'bg-rose-50 border-rose-100 text-rose-600'
                    }`}
                    aria-pressed={newProduct.active}
                  >
                    {newProduct.active ? 'Đang bán (active)' : 'Ẩn (inactive)'}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Ảnh sản phẩm</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  <div className="sm:col-span-2 space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setNewProduct({ ...newProduct, imageFile: file });
                      }}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                    />
                    <input
                      type="text"
                      value={newProduct.imageUrl}
                      onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                      placeholder="Hoặc dán URL ảnh (nếu backend nhận string)"
                    />
                    <p className="text-[10px] font-bold text-text-muted">
                      Ưu tiên: chọn file (multipart). Nếu không chọn file, hệ thống sẽ dùng URL nếu có.
                    </p>
                  </div>

                  <div className="sm:col-span-1">
                    <div className="aspect-square rounded-2xl border border-border bg-slate-50 overflow-hidden">
                      <img
                        src={
                          imagePreviewUrl ||
                          newProduct.imageUrl ||
                          'https://images.unsplash.com/photo-1501004318641-729e8439a7e7?auto=format&fit=crop&w=600&q=80'
                        }
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1501004318641-729e8439a7e7?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 hover:opacity-90 transition-all mt-4">
                Xác nhận thêm
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
