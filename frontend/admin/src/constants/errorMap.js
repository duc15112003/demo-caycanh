// Mapping error codes từ backend sang message thân thiện
export const errorMap = {
  'AUTH_TOKEN_EXPIRED': 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  'AUTH_INVALID_TOKEN': 'Token không hợp lệ.',
  'PERMISSION_DENIED': 'Bạn không có quyền truy cập tài nguyên này.',
  'RESOURCE_NOT_FOUND': 'Không tìm thấy tài nguyên yêu cầu.',
  'VALIDATION_ERROR': 'Dữ liệu nhập không hợp lệ.',
  'SERVER_ERROR': 'Lỗi máy chủ. Vui lòng thử lại sau.',
  'NETWORK_ERROR': 'Lỗi kết nối mạng.',
  // Thêm các error codes khác từ backend
};
