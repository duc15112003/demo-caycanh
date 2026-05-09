import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import productApi from '../api/productApi';
import cartApi from '../api/cartApi';
import wishlistApi from '../api/wishlistApi';
import { notifyCartUpdated } from '../utils/cartEvents';
import '../assets/css/ProductDetail.css';

const CATEGORY_META = {
    1: { label: 'Cây cảnh', path: '/product/cay' },
    2: { label: 'Chậu cây', path: '/product/chau' },
    3: { label: 'Phụ kiện', path: '/product/phukien' },
};

const ProductDetail = () => {
    // useParams() dùng để lấy ID sản phẩm trên URL (ví dụ: /product/1)
    const { id } = useParams();

    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(state => state.auth);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                // Lấy data bằng id thực tế thay vì hardcode
                let data = await productApi.getProductById(id);
                // Vì API getProductById thường trả về list object có 1 data detail hoặc trực tiếp 1 object, mình xử lý để không bị lỗi
                if (Array.isArray(data)) {
                    data = data.length > 0 ? data[0] : null;
                }
                setProduct(data);
            } catch (error) {
                console.error("Lỗi lấy chi tiết sản phẩm:", error);
            }
        };
        fetchDetail();
    }, [id]);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return navigate('/login');
        try {
            await cartApi.addItemToCart(product.productId, 1);
            notifyCartUpdated();
            toast.success('Đã thêm sản phẩm vào giỏ hàng!');
        } catch (error) {
            toast.error(error.customMessage || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
            console.error(error);
        }
    };

    const handleAddToWishlist = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return navigate('/login');
        try {
            await wishlistApi.addToWishlist(product.productId);
            toast.success('Đã lưu vào danh sách yêu thích!');
        } catch (error) {
            toast.error(error.customMessage || 'Có lỗi xảy ra khi thêm vào yêu thích');
            console.error(error);
        }
    };

    if (!product) return <div>Đang tải...</div>;

    const categoryMeta = CATEGORY_META[Number(product.categoryId)] || { label: 'Sản phẩm', path: '/product' };

    return (
        <section className="product-detail-page">
            <div className="container">
                <div className="detail-wrapper">
                    {/* Hình ảnh */}
                    <div className="detail-gallery">
                        <img 
                            src={product.image}
                            alt={product.productName || product.name} 
                            className="main-image" 
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x400?text=No+Image" }}
                        />
                    </div>

                    {/* Thông tin */}
                    <div className="detail-info">
                        <div className="breadcrumb">
                            <Link to="/">Trang chủ</Link> / <Link to={categoryMeta.path}>{categoryMeta.label}</Link> / <span>{product.productName || product.name}</span>
                        </div>
                        <h1 className="product-title">{product.productName || product.name}</h1>

                        <div className="product-meta">
                            <span className="price-tag">
                                {product.price ? product.price.toLocaleString('vi-VN') : 0}₫
                            </span>
                            {product.stock > 0 ? (
                                <span className="stock-badge in-stock">
                                    <i className="fas fa-check-circle"></i> Còn hàng ({product.stock})
                                </span>
                            ) : (
                                <span className="stock-badge out-stock">
                                    <i className="fas fa-times-circle"></i> Hết hàng
                                </span>
                            )}
                        </div>

                        <div className="product-meta" style={{ marginTop: '-15px' }}>
                            <span className="rating-stars">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                            </span>
                            <span className="review-count">(Xem 18 đánh giá)</span>
                        </div>

                        {/* Description render HTML */}
                        <div className="description" dangerouslySetInnerHTML={{ __html: product.description }}></div>

                        <div className="action-group">
                            {product.stock > 0 ? (
                                <>
                                    <button onClick={handleAddToCart} className="btn-add-cart" style={{ border: 'none', cursor: 'pointer' }}>
                                        <i className="fas fa-shopping-bag"></i> Thêm vào giỏ hàng
                                    </button>
                                    <button onClick={handleAddToWishlist} className="btn-wishlist">
                                        <i className="fa-regular fa-heart"></i>
                                    </button>
                                </>
                            ) : (
                                <button className="btn-add-cart" style={{ background: '#999', cursor: 'not-allowed', border: 'none' }}>
                                    <i className="fas fa-envelope"></i> Nhận tin khi có hàng
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Phần Review (Đánh giá) */}
                <div className="section-box">
                    <h3 className="box-title">Khách hàng nói gì?</h3>
                    <div className="review-list">
                        <div className="review-card">
                            <div className="review-user">
                                <span className="user-name">Nguyễn Thùy Linh</span>
                                <span className="rating-stars" style={{ fontSize: '10px' }}>
                                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                                </span>
                            </div>
                            <p className="review-text">"Cây xinh xỉu shop ơi! Đóng gói siêu kỹ, lá không bị dập tí nào. Sẽ ủng hộ dài dài."</p>
                            <span className="review-time">2 ngày trước</span>
                        </div>
                        <div className="review-card">
                            <div className="review-user">
                                <span className="user-name">Hoàng Minh</span>
                                <span className="rating-stars" style={{ fontSize: '10px' }}>
                                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="far fa-star"></i>
                                </span>
                            </div>
                            <p className="review-text">"Giao hàng hơi lâu chút nhưng bù lại cây rất tươi. Giá hợp lý."</p>
                            <span className="review-time">1 tuần trước</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;
