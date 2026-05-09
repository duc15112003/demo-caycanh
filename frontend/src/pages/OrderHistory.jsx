import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userApi from '../api/userApi';
import './OrderHistory.css';

const formatDate = (value) => {
    if (!value) return '--';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString('vi-VN');
};

const normalizeStatus = (status) => (status || '').toLowerCase().trim();

const renderStatusBadge = (status) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
        case 'chờ xử lý':
        case 'cho xu ly':
        case 'pending':
            return <span className="status-badge pending"><i className="fas fa-clock"></i> Chờ xử lý</span>;
        case 'đang giao':
        case 'dang giao':
        case 'shipping':
            return <span className="status-badge shipping"><i className="fas fa-truck"></i> Đang giao</span>;
        case 'hoàn thành':
        case 'hoan thanh':
        case 'completed':
            return <span className="status-badge completed"><i className="fas fa-check-circle"></i> Hoàn thành</span>;
        case 'đã hủy':
        case 'da huy':
        case 'cancelled':
        case 'canceled':
            return <span className="status-badge cancelled"><i className="fas fa-times-circle"></i> Đã hủy</span>;
        default:
            return <span className="status-badge default">{status || 'Không xác định'}</span>;
    }
};

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchOrders = async () => {
            try {
                const response = await userApi.getMyOrderHistory();
                const nextOrders = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.orders)
                        ? response.orders
                        : [];

                if (isMounted) {
                    setOrders(nextOrders);
                }
            } catch (error) {
                console.error('Loi lay lich su don hang:', error);
                if (isMounted) {
                    setOrders([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchOrders();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="order-history-section">
            <div className="order-history-container">
                <div className="order-history-header">
                    <h2><i className="fas fa-history"></i> Lịch Sử Đơn Hàng</h2>
                    <p>Theo dõi và quản lý các đơn hàng bạn đã mua tại Tree Shop</p>
                </div>

                {loading ? (
                    <div className="empty-orders-alert">
                        <div className="empty-icon">
                            <i className="fas fa-spinner fa-spin"></i>
                        </div>
                        <h3>Đang tải đơn hàng</h3>
                        <p>Hệ thống đang lấy danh sách đơn hàng của bạn.</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-orders-alert">
                        <div className="empty-icon">
                            <i className="fas fa-shopping-basket"></i>
                        </div>
                        <h3>Bạn chưa có đơn hàng nào</h3>
                        <p>Hãy khám phá các sản phẩm xanh mát tại cửa hàng của chúng tôi.</p>
                        <Link to="/product/cay" className="btn-shop-now">Mua sắm ngay</Link>
                    </div>
                ) : (
                    <div className="orders-grid">
                        {orders.map((order) => (
                            <div className="order-card" key={order.orderId}>
                                <div className="order-card-header">
                                    <div className="order-id">
                                        <span className="label">Mã đơn hàng</span>
                                        <strong>#{order.orderId}</strong>
                                    </div>
                                    <div className="order-status">
                                        {renderStatusBadge(order.status || order.orderStatus)}
                                    </div>
                                </div>
                                <div className="order-card-body">
                                    <div className="order-info-row">
                                        <div className="info-group">
                                            <i className="far fa-calendar-alt"></i>
                                            <div>
                                                <span className="label">Ngày đặt</span>
                                                <span>{formatDate(order.orderDate)}</span>
                                            </div>
                                        </div>
                                        <div className="info-group">
                                            <i className="fas fa-box-open"></i>
                                            <div>
                                                <span className="label">Sản phẩm</span>
                                                <span>{Array.isArray(order.items) ? order.items.length : (order.itemsCount || 0)} mặt hàng</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="order-info-row address-row">
                                        <div className="info-group">
                                            <i className="fas fa-map-marker-alt"></i>
                                            <div>
                                                <span className="label">Địa chỉ giao hàng</span>
                                                <span className="address-text">{order.shippingAddress || '--'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="order-card-footer">
                                    <div className="order-total">
                                        <span className="label">Tổng tiền:</span>
                                        <span className="amount">{Number(order.totalAmount || 0).toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <Link to={`/order/confirm/${order.orderId}`} className="btn-detail-order">
                                        Xem chi tiết <i className="fas fa-arrow-right"></i>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default OrderHistory;
