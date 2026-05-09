# AdminPro Dashboard

Hệ thống Admin Dashboard hiện đại được xây dựng bằng ReactJS + Tailwind CSS.

## Tính năng

- **Dashboard**: Thống kê tổng quan, biểu đồ Chart.js, đơn hàng gần đây
- **Quản lý Đơn hàng**: Bảng danh sách đơn hàng với trạng thái
- **Quản lý Sản phẩm**: Grid sản phẩm với overlay hết hàng
- **Quản lý Khách hàng**: Bảng khách hàng với tìm kiếm debounce
- **Layout Responsive**: Sidebar collapsible, mobile-friendly
- **API Integration**: Axios với error handling, token auth
- **Error Boundary**: Xử lý lỗi toàn cục
- **Tailwind CSS**: Styling utility-first

## Cấu trúc thư mục

```
src/
├── components/          # UI components
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── MainLayout.jsx
│   └── ErrorBoundary.jsx
├── pages/               # Page components
│   ├── Dashboard.jsx
│   ├── Orders.jsx
│   ├── Products.jsx
│   └── Customers.jsx
├── services/            # API services
│   └── api.js
├── constants/           # Constants
│   ├── config.js
│   └── errorMap.js
└── App.jsx              # Main app
```

## Chạy dự án

```bash
npm install
npm start
```

## Cấu hình Backend

Dự án hiện tại sử dụng dữ liệu mẫu (mock data) trong `src/constants/mockData.js` để phát triển. Khi backend sẵn sàng:

1. Cập nhật `src/constants/config.js` với `REACT_APP_API_BASE_URL`
2. Thêm endpoints thực tế vào `src/services/api.js`
3. Mapping error codes trong `src/constants/errorMap.js` theo backend
4. Thay thế mock data bằng API calls trong các pages

## Công nghệ sử dụng

- ReactJS
- TailwindCSS
- React Scripts
- Chart.js
- Axios
- React Router DOM
