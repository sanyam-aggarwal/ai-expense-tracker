const TOKEN_KEY = "expense_tracker_token";
const USER_KEY = "expense_tracker_user";

export const authService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUserDetails: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY)),
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
