export const ERROR_CODE_MESSAGES = {
  "000": "Generic/Technical Error",
  "001": "Invalid required fields: %s",
  "100": "Thong tin dang ky khong hop le",
  "101": "Email khong duoc de trong",
  "102": "Mat khau khong duoc de trong",
  "103": "Email da ton tai",
  "104": "Khong the tao tai khoan",
  "105": "User khong ton tai",
  "106": "Sai ten dang nhap hoac mat khau",
  "107": "Nguoi dung chua dang nhap",
  "108": "Khong lay duoc thong tin nguoi dung hien tai",
  "109": "Tai khoan da bi vo hieu hoa",
  "110": "So dien thoai da ton tai",
  "111": "Mat khau hien tai khong dung",
  "200": "Khong tim thay san pham",
  "201": "Thong tin san pham khong hop le",
  "202": "Danh muc san pham khong hop le",
  "203": "Ten san pham khong duoc de trong",
  "204": "Gia san pham phai lon hon 0",
  "205": "So luong ton kho khong hop le",
  "206": "Keyword khong duoc de trong",
  "207": "Limit phai lon hon 0",
  "300": "Khong tim thay danh muc",
  "301": "Ten danh muc khong duoc de trong",
  "400": "Yeu cau khong hop le",
  "401": "Ban chua dang nhap hoac phien dang nhap da het han",
  "404": "Khong tim thay tai nguyen yeu cau",
  "500": "Dia chi giao hang khong duoc de trong",
  "501": "Khong tim thay don hang",
  "502": "Trang thai khong duoc de trong",
  "503": "Ban khong co quyen truy cap don hang nay",
  "600": "Thong tin thanh toan khong hop le",
  "601": "Phuong thuc thanh toan khong duoc de trong",
  "602": "Khong tim thay giao dich",
  "700": "Ban khong co quyen truy cap tai nguyen nay",
  "701": "JWT token da het han",
  "702": "JWT token khong hop le",
  "703": "Thong tin trong token khong khop voi user trong he thong",
  "800": "File anh/video khong duoc de trong",
  "801": "Loi trong qua trinh tai file len Cloudinary",
  "4001": "So luong phai lon hon 0",
  "4002": "Khong tim thay cart item",
  "4003": "Cart item khong thuoc user hien tai",
  "4004": "Gio hang dang trong",
  "01": "Order not found",
  "02": "Order already processed",
  "04": "Invalid amount",
  "24": "Payment failed",
  "97": "Invalid signature",
  "99": "Unknown error",
};

export const ERROR_CODES = {
  UNKNOWN_ERROR: "Lỗi hệ thống không xác định. Vui lòng thử lại sau.",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
  BAD_REQUEST: "Yêu cầu không hợp lệ.",
  RESOURCE_NOT_FOUND: "Không tìm thấy tài nguyên yêu cầu.",
  UNAUTHORIZED: "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.",
  INVALID_REGISTRATION: "Thông tin đăng ký không hợp lệ.",
  EMAIL_REQUIRED: "Email không được để trống.",
  PASSWORD_REQUIRED: "Mật khẩu không được để trống.",
  EMAIL_ALREADY_EXISTS: "Email đã tồn tại.",
  ACCOUNT_CREATION_FAILED: "Không thể tạo tài khoản.",
  USER_NOT_FOUND: "Người dùng không tồn tại.",
  INVALID_CREDENTIALS: "Sai tên đăng nhập hoặc mật khẩu.",
  AUTHENTICATION_REQUIRED: "Người dùng chưa đăng nhập.",
  CURRENT_USER_UNAVAILABLE: "Không lấy được thông tin người dùng hiện tại.",
  USER_DISABLED: "Tài khoản đã bị vô hiệu hóa.",
  PHONE_ALREADY_EXISTS: "Số điện thoại đã tồn tại.",
  CURRENT_PASSWORD_INCORRECT: "Mật khẩu hiện tại không đúng.",
  INVALID_GOOGLE_TOKEN: "Google token không hợp lệ.",
  GOOGLE_EMAIL_NOT_VERIFIED: "Email Google chưa được xác minh.",
  PASSWORD_RESET_TOKEN_INVALID: "Token đặt lại mật khẩu không hợp lệ.",
  EMAIL_SEND_FAILED: "Không thể gửi email xác thực.",
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm này.",
  INVALID_PRODUCT: "Thông tin sản phẩm không hợp lệ.",
  INVALID_PRODUCT_CATEGORY: "Danh mục sản phẩm không hợp lệ.",
  PRODUCT_NAME_REQUIRED: "Tên sản phẩm không được để trống.",
  INVALID_PRODUCT_PRICE: "Giá sản phẩm phải lớn hơn 0.",
  INVALID_PRODUCT_STOCK: "Số lượng tồn kho không hợp lệ.",
  KEYWORD_REQUIRED: "Từ khóa không được để trống.",
  LIMIT_MUST_BE_POSITIVE: "Limit phải lớn hơn 0.",
  CATEGORY_NOT_FOUND: "Không tìm thấy danh mục này.",
  CATEGORY_NAME_REQUIRED: "Tên danh mục không được để trống.",
  QUANTITY_MUST_BE_POSITIVE: "Số lượng phải lớn hơn 0.",
  CART_ITEM_NOT_FOUND: "Không tìm thấy sản phẩm này trong giỏ hàng.",
  CART_ITEM_NOT_OWNED: "Sản phẩm không thuộc giỏ hàng hiện tại.",
  EMPTY_CART: "Giỏ hàng đang trống.",
  SHIPPING_ADDRESS_REQUIRED: "Địa chỉ giao hàng không được để trống.",
  ORDER_NOT_FOUND: "Không tìm thấy đơn hàng.",
  ORDER_STATUS_REQUIRED: "Trạng thái đơn hàng không được để trống.",
  ORDER_ACCESS_DENIED: "Bạn không có quyền truy cập đơn hàng này.",
  INVALID_PAYMENT: "Thông tin thanh toán không hợp lệ.",
  PAYMENT_METHOD_REQUIRED: "Phương thức thanh toán không được để trống.",
  PAYMENT_NOT_FOUND: "Không tìm thấy giao dịch này.",
  ACCESS_DENIED: "Bạn không có quyền truy cập.",
  JWT_TOKEN_EXPIRED: "Phiên đăng nhập đã hết hạn.",
  INVALID_JWT_TOKEN: "Token không hợp lệ.",
  TOKEN_USER_MISMATCH: "Thông tin token không khớp với hệ thống.",
  FILE_EMPTY: "File không được để trống.",
  FILE_UPLOAD_FAILED: "Tải file thất bại.",
  INVALID_SIGNATURE: "Chữ ký thanh toán không hợp lệ.",
  PAYMENT_FAILED: "Thanh toán thất bại.",
  ORDER_ALREADY_PROCESSED: "Đơn hàng đã được xử lý trước đó.",
  INVALID_AMOUNT: "Số tiền thanh toán không hợp lệ.",
};

const DEFAULT_MESSAGE = "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.";

const parseValidationMessage = (message) => {
  if (!message) return ERROR_CODES.VALIDATION_ERROR;
  return message;
};

const resolveMessageByCode = (errorCode, unifiedErrorCode, fallbackMessage) => {
  if (errorCode && ERROR_CODES[errorCode]) {
    return ERROR_CODES[errorCode];
  }

  if (unifiedErrorCode && ERROR_CODE_MESSAGES[unifiedErrorCode]) {
    return fallbackMessage || ERROR_CODE_MESSAGES[unifiedErrorCode];
  }

  return fallbackMessage || DEFAULT_MESSAGE;
};

export const parseApiErrorDetails = (error) => {
  const responseData = error?.response?.data;

  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    const firstError = responseData.errors[0];
    const errorCode = firstError?.errorCode || null;
    const unifiedErrorCode = firstError?.unifiedErrorCode || null;
    const rawMessage = firstError?.errorMessage || null;
    const message =
      errorCode === "VALIDATION_ERROR"
        ? parseValidationMessage(rawMessage)
        : resolveMessageByCode(errorCode, unifiedErrorCode, rawMessage);

    return {
      customErrorCode: unifiedErrorCode || errorCode || "000",
      customMessage: message,
    };
  }

  if (responseData?.errorCode) {
    return {
      customErrorCode: responseData.errorCode,
      customMessage: resolveMessageByCode(responseData.errorCode, null, responseData.message),
    };
  }

  if (responseData?.RspCode) {
    return {
      customErrorCode: responseData.RspCode,
      customMessage: resolveMessageByCode(null, responseData.RspCode, responseData.Message),
    };
  }

  if (responseData?.message) {
    return {
      customErrorCode: String(error?.response?.status || "000"),
      customMessage: responseData.message,
    };
  }

  return {
    customErrorCode: "000",
    customMessage: DEFAULT_MESSAGE,
  };
};

export const parseApiError = (error) => parseApiErrorDetails(error).customMessage;
