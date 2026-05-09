import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Payment = () => {
    const navigate = useNavigate();
    
    // Giả lập dữ liệu đơn hàng được truyền từ trang Checkout sang
    const [order] = useState({
        orderId: '889922',
        total: 450000
    });

    const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Xác nhận thanh toán:", { orderId: order.orderId, method: paymentMethod, amount: order.total });
        // TODO: Gọi API xác nhận thanh toán ở đây
        toast.success('Đã xác nhận thanh toán!');
        navigate('/order/success'); // Chuyển sang trang OrderSuccess
    };

    return (
        <section className="home-content">
            <style>{`
                .payment-wrapper { max-width: 600px; margin: 40px auto; background: #fff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; font-family: 'Quicksand', sans-serif; }
                .order-summary { background: #f7fcf7; padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 1px dashed #2d6a4f; }
                .total-amount { font-size: 28px; color: #164a3e; font-weight: 700; margin: 10px 0; }
                .custom-select { width: 100%; padding: 15px; font-size: 16px; border: 2px solid #eee; border-radius: 10px; margin-bottom: 20px; color: #333; outline: none; background: #fff; }
                .custom-select:focus { border-color: #2d6a4f; }
                .btn-pay { background: #2d6a4f; color: #fff; padding: 15px 40px; border-radius: 50px; border: none; font-size: 16px; font-weight: 700; cursor: pointer; width: 100%; transition: 0.3s; }
                .btn-pay:hover { background: #1b4332; box-shadow: 0 5px 15px rgba(27, 67, 50, 0.2); }
                .qr-box img { width: 100%; max-width: 300px; border-radius: 10px; margin-top: 10px; border: 1px solid #ddd; }
            `}</style>

            <div className="payment-wrapper">
                <h2 style={{ color: '#1b4332', marginBottom: '20px' }}>Thanh Toán Đơn Hàng</h2>

                <div className="order-summary">
                    <p style={{ margin: 0, color: '#666' }}>Mã đơn hàng: <b>#{order.orderId}</b></p>
                    <div className="total-amount">
                        <span>{order.total.toLocaleString('vi-VN')}</span> VNĐ
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Vui lòng chọn phương thức thanh toán</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ textAlign: 'left', marginBottom: '10px', fontWeight: 600 }}>Phương thức thanh toán:</div>
                    
                    <select 
                        className="custom-select" 
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                        required
                    >
                        <option value="Tiền mặt">💵 Thanh toán khi giao hàng (COD)</option>
                        <option value="Chuyển khoản">🏦 Chuyển khoản ngân hàng</option>
                    </select>

                    {/* QR Code sẽ tự động hiện nếu chọn Chuyển khoản */}
                    {paymentMethod === 'Chuyển khoản' && (
                        <div className="qr-box" style={{ margin: '20px 0', background: '#fafafa', padding: '15px', borderRadius: '10px' }}>
                            <h4 style={{ color:'#1b4332', fontSize:'18px', marginBottom: '5px' }}>Quét mã QR để thanh toán</h4>
                            <p style={{ color: '#666', fontSize: '13px' }}>(Tự động điền số tiền và nội dung)</p>
                            <img 
                                src={`https://img.vietqr.io/image/STB-060308333003-print.png?amount=${order.total}&addInfo=SP ${order.orderId}`} 
                                alt="QR Banking Sacombank" 
                            />
                            <p style={{ fontSize: '14px', color: '#333', marginTop:'15px' }}>
                                Nội dung chuyển khoản: <b style={{ color: '#d35400' }}>SP {order.orderId}</b>
                            </p>
                        </div>
                    )}

                    <button type="submit" className="btn-pay">XÁC NHẬN THANH TOÁN</button>
                </form>
            </div>
        </section>
    );
};

export default Payment;