import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import wishlistApi from '../api/wishlistApi';
import cartApi from '../api/cartApi';

const Wishlist = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(state => state.auth);
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchWishlist = async () => {
            try {
                const response = await wishlistApi.getWishlist();
                setWishlistItems(response.items || []);
            } catch (error) {
                console.error("Lỗi lấy danh sách yêu thích:", error);
            }
        };
        fetchWishlist();
    }, [isAuthenticated]);

    const handleRemove = async (productId) => {
        if(window.confirm('Bạn muốn xoá sản phẩm này khỏi yêu thích?')) {
            try {
                await wishlistApi.removeFromWishlist(productId);
                setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleAddToCart = async (e, productId) => {
        e.preventDefault();
        try {
            await cartApi.addItemToCart(productId, 1);
            toast.success('Đã thêm sản phẩm ' + productId + ' vào giỏ hàng!');
        } catch (error) {
            toast.error(error.customMessage || "Lỗi khi thêm vào giỏ hàng");
            console.error(error);
        }
    };

    return (
        <section className="home-content">
            <style>{`
                .wishlist-container { padding: 40px 20px; max-width: 1100px; margin: auto; background-color: #fff; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
                .wishlist-container h2 { margin-bottom: 30px; font-size: 32px; font-family: serif; color: #333; }
                .empty-message { text-align: center; font-size: 18px; color: #777; padding: 50px 0; }
                .wishlist-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .wishlist-table th { text-align: left; padding: 15px 10px; text-transform: uppercase; font-size: 12px; color: #888; border-bottom: 1px solid #eee; }
                .product-row { border-bottom: 1px solid #eee; }
                .wishlist-table td { padding: 20px 10px; vertical-align: middle; }
                .product-info-cell { display: flex; align-items: center; }
                .btn-remove-x { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border: 1px solid #ddd; border-radius: 50%; color: #999; text-decoration: none; font-size: 18px; margin-right: 20px; cursor: pointer; transition: 0.2s; }
                .btn-remove-x:hover { border-color: #e74c3c; color: #e74c3c; }
                .wishlist-thumb { width: 80px; height: 80px; object-fit: cover; margin-right: 20px; border-radius: 5px; }
                .wishlist-name { margin: 0; font-size: 15px; color: #333; }
                .wishlist-price { font-size: 16px; font-weight: bold; color: #28a745; }
                .btn-add-cart { display: inline-block; background-color: #1b4332; color: #fff; padding: 8px 20px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; border-radius: 4px; transition: 0.3s; border: none; cursor: pointer; }
                .btn-add-cart:hover { background-color: #28a745; }
            `}</style>

            <div className="wishlist-container">
                <h2>Sản phẩm yêu thích</h2>

                {wishlistItems.length === 0 ? (
                    <div className="empty-message">
                        Chưa có sản phẩm yêu thích nào.
                    </div>
                ) : (
                    <table className="wishlist-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50%' }}>SẢN PHẨM</th>
                                <th style={{ width: '20%' }}>ĐƠN GIÁ</th>
                                <th style={{ width: '30%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlistItems.map((item) => (
                                <tr key={item.productId} className="product-row">
                                    <td>
                                        <div className="product-info-cell">
                                            <button onClick={() => handleRemove(item.productId)} className="btn-remove-x" title="Xóa">×</button>
                                            <Link to={`/product/${item.productId}`}>
                                                <img src={`/images/${item.image}`} alt={item.productName} className="wishlist-thumb" />
                                            </Link>
                                            <h4 className="wishlist-name">{item.productName}</h4>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="wishlist-price">{item.price.toLocaleString('vi-VN')} ₫</span>
                                    </td>
                                    <td>
                                        <button onClick={(e) => handleAddToCart(e, item.productId)} className="btn-add-cart">
                                            Thêm vào giỏ hàng
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
};

export default Wishlist;