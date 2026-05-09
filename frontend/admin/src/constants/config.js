// Base URL của backend (KHÔNG kèm `/api` nếu bạn set full ở env).
// Ví dụ: `http://localhost:8080/api`
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.toString?.() || 'http://localhost:8080/api';
