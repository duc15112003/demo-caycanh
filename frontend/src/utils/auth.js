export const isAdminRole = (role = "") => {
  const normalizedRole = String(role).toUpperCase();
  return normalizedRole === "ADMIN" || normalizedRole === "ROLE_ADMIN";
};
