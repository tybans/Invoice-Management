export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Login failed');
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data.user;
  } catch (error) {
    console.error(error);
    return null;
  }
};
