export const logout = () => {
  // Remove stored auth data
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Redirect to login page (clears history stack)
  window.location.replace('/');
};
