import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import cartApi from '../api/cartApi';
import { notifyCartUpdated } from '../utils/cartEvents';

const Cart = () => {
    const { isAuthenticated } = useSelector(state => state.auth);
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    // Lấy dữ liệu giỏ hàng ban đầu
    useEffect(() => {
        const fetchCart = async () => {
            if (!isAuthenticated) return;
            try {
                const response = await cartApi.getCart();
                setCartItems(response.items || []);
            } catch (error) {
                console.error("Lỗi tải giỏ hàng:", error);
            }
        };
        fetchCart();
    }, [isAuthenticated]);

    // Tính lại tổng tiền mỗi khi cartItems thay đổi
    useEffect(() => {
        const newTotal = cartItems.reduce((sum, item) => {
            if (item.product && item.product.price) {
                return sum + (item.product.price * item.quantity);
            }
            return sum;
        }, 0);
        setTotal(newTotal);
    }, [cartItems]);

    // Xử lý khi thay đổi số lượng
    const handleQuantityChange = async (cartItemId, newQuantity) => {
        if(newQuantity < 1) return;
        const parsed = parseInt(newQuantity);

        try {
            await cartApi.updateCartItem(cartItemId, parsed);
            // Cập nhật giao diện khi API thành công
            setCartItems(prevItems => prevItems.map(item => 
                item.cartItemId === cartItemId ? { ...item, quantity: parsed } : item
            ));
            notifyCartUpdated();
        } catch (error) {
            console.error("Lỗi cập nhật số lượng:", error);
        }
    };

    // Xử lý xóa sản phẩm
    const handleRemove = async (cartItemId) => {
        try {
            await cartApi.removeCartItem(cartItemId);
            setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
            notifyCartUpdated();
        } catch (error) {
            console.error("Lỗi xóa khỏi giỏ hàng:", error);
        }
    };

    return (
        <section className="home-content" style={{ paddingBottom: '50px' }}>
            <h1 style={{ textAlign: 'center', color: '#164a3e', margin: '40px 0', textTransform: 'uppercase' }}>Giỏ hàng của bạn</h1>
            
            <div className="cart-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
                
                {cartItems.length === 0 ? (
                    <div className="empty-msg" style={{ textAlign: 'center', color: '#777', marginTop: '50px' }}>
                        <h3>Giỏ hàng đang trống...</h3>
                        <p>Hãy quay lại cửa hàng để chọn món đồ ưng ý nhé!</p>
                        <Link to="/product" className="btn-action continue-btn" style={{ marginTop: '20px' }}>Tiếp tục mua sắm</Link>
                    </div>
                ) : (
                    <div>
                        <div className="cart-header" style={{ display: 'grid', gridTemplateColumns: '50px 120px 2fr 1fr 1fr 1fr', gap: '20px', fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                            <div className="text-center"><i className="fa-solid fa-leaf"></i></div>
                            <div>Sản phẩm</div>
                            <div>Tên</div>
                            <div className="text-center">Giá</div>
                            <div className="text-center">Số lượng</div>
                            <div style={{ textAlign: 'right' }}>Thành tiền</div>
                        </div>
                        
                        {cartItems.map(ci => (
                            <div key={ci.cartItemId} className="cart-item" style={{ display: 'grid', gridTemplateColumns: '50px 120px 2fr 1fr 1fr 1fr', alignItems: 'center', gap: '20px', padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <button onClick={() => handleRemove(ci.cartItemId)} className="btn-remove" style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: 'transparent', cursor: 'pointer' }}>&#10005;</button>
                                <img src={`/images/${ci.product.image}`} alt={ci.product.productName} className="cart-img" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                <div className="cart-name" style={{ fontWeight: 600 }}>{ci.product.productName}</div>
                                
                                <div className="text-center">
                                    <span className="cart-price" style={{ color: '#006a54', fontWeight: 700 }}>{ci.product.price.toLocaleString('vi-VN')}</span> VNĐ
                                </div>
                                
                                <div className="qty-form" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <input 
                                        type="number" 
                                        className="qty-input" 
                                        min="1" 
                                        value={ci.quantity} 
                                        onChange={(e) => handleQuantityChange(ci.cartItemId, e.target.value)}
                                        style={{ width: '50px', textAlign: 'center', padding: '5px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                
                                <div className="cart-subtotal" style={{ color: '#006a54', fontWeight: 700, textAlign: 'right' }}>
                                    {(ci.product.price * ci.quantity).toLocaleString('vi-VN')} VNĐ
                                </div>
                            </div>
                        ))}

                        <div className="total-box" style={{ marginTop: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="total-text" style={{ fontSize: '20px', marginBottom: '30px' }}>
                                Tổng cộng: <span className="total-price" style={{ color: '#006a54', fontWeight: 700, fontSize: '28px' }}>{total.toLocaleString('vi-VN')}</span> VNĐ
                            </div>
                            
                            <div className="cart-actions" style={{ display: 'flex', gap: '20px' }}>
                                <Link to="/product" className="btn-action continue-btn" style={{ padding: '15px 40px', borderRadius: '50px', textDecoration: 'none', border: '2px solid #164a3e', color: '#164a3e' }}>
                                    <i className="fas fa-arrow-left"></i> Tiếp tục mua hàng
                                </Link>
                                <Link to="/checkout" className="btn-action checkout-btn" style={{ padding: '15px 40px', borderRadius: '50px', textDecoration: 'none', backgroundColor: '#164a3e', color: 'white' }}>
                                    Thanh toán <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Cart;
