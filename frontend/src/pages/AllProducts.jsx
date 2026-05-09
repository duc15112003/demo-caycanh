import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import productApi from '../api/productApi';
import cartApi from '../api/cartApi';
import { notifyCartUpdated } from '../utils/cartEvents';

const AllProducts = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const { isAuthenticated } = useSelector(state => state.auth);

    // Fetch API dựa vào location search (dành cho search keyword sau này)
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Kiểm tra xem có query search keyword không
                const searchParams = new URLSearchParams(location.search);
                const keyword = searchParams.get('keyword');

                let data;
                if (keyword) {
                    data = await productApi.searchProducts(keyword);
                } else {
                    data = await productApi.getAllProducts();
                }
                setProducts(data || []);
            } catch (error) {
                console.error("Lỗi lấy danh sách sản phẩm: ", error);
            }
        };
        fetchProducts();
    }, [location.search]);

    const handleAddToCart = async (e, productId) => {
        e.preventDefault(); 
        
        if (!isAuthenticated) {
            toast.warning("Vui lòng đăng nhập để thêm vào giỏ hàng");
            navigate('/login');
            return;
        }

        try {
            await cartApi.addItemToCart(productId, 1);
            notifyCartUpdated();
            toast.success(`Đã thêm sản phẩm vào giỏ hàng!`);
        } catch(error) {
            toast.error(error.customMessage || "Lỗi thêm vào giỏ hàng!");
            console.error(error);
        }
    };

    return (
        <section className="home-content">
            {/* Bạn có thể đưa phần CSS này ra file AllProducts.css */}
            <style>{`
                .home-content { font-family: 'Quicksand', sans-serif; background-color: #fdfdfd; color: #444; padding: 40px 20px; }
                .home-content h1 { text-align: center; color: #2d6a4f; font-weight: 700; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 1px; }
                .product-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }
                .product-box { background: #fff; border-radius: 20px; padding: 15px; text-align: center; transition: all 0.3s ease; border: 1px solid #f0f0f0; display: flex; flex-direction: column; justify-content: space-between; }
                .product-box:hover { transform: translateY(-8px); box-shadow: 0 10px 20px rgba(45, 106, 79, 0.1); border-color: #d8f3dc; }
                .product-box img { width: 100%; height: 220px; object-fit: cover; border-radius: 15px; margin-bottom: 15px; }
                .product-box h3 { font-size: 18px; font-weight: 700; color: #1b4332; margin: 0 0 10px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .meta-info { display: flex; justify-content: center; align-items: center; gap: 10px; font-size: 14px; margin-bottom: 10px; color: #666; background: #f8fcf9; padding: 5px; border-radius: 8px; }
                .price-tag { color: #2d6a4f; font-weight: 700; font-size: 16px; }
                .desc-text { font-size: 13px; color: #777; margin-bottom: 20px; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; height: 38px; line-height: 1.5; }
                .action-buttons { display: flex; gap: 10px; justify-content: center; margin-top: auto; }
                .btn-detail { padding: 10px 15px; border: 1px solid #2d6a4f; color: #2d6a4f; border-radius: 50px; text-decoration: none; font-size: 13px; font-weight: 600; transition: 0.3s; flex: 1; }
                .btn-detail:hover { background: #e8f5e9; }
                .btn-cart { padding: 10px 15px; background: #d4a373; color: white; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 13px; border: none; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 5px; flex: 1.5; cursor: pointer; }
                .btn-cart:hover { background: #b08968; color: #fff; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(212, 163, 115, 0.4); }
            `}</style>

            <h1>Tất cả sản phẩm</h1>
            <div className="product-container">
                {products.map(p => {
                    const id = p.productId || p.id;
                    return (
                    <div key={id} className="product-box">
                        <img 
                            src={p.image ? `/images/${p.image}` : "https://placehold.co/200x200?text=No+Image"} 
                            alt={p.productName || p.name} 
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x200?text=No+Image" }}
                        />
                        <h3>{p.productName || p.name}</h3>
                        
                        <div className="meta-info">
                            <span className="price-tag">{p.price ? p.price.toLocaleString('vi-VN') : 0} VNĐ</span>
                            <span style={{ color: '#ddd' }}>|</span>
                            <span>Kho: <b>{p.stock}</b></span>
                        </div>
                        
                        <div className="desc-text" dangerouslySetInnerHTML={{ __html: p.description }}></div>
                        
                        <div className="action-buttons">
                            <Link to={`/product/${id}`} className="btn-detail">
                                Xem chi tiết
                            </Link>
                            <button onClick={(e) => handleAddToCart(e, id)} className="btn-cart">
                                <i className="fas fa-shopping-cart"></i> Mua ngay
                            </button>
                        </div>
                    </div>
                )})}
            </div>
        </section>
    );
};

export default AllProducts;
