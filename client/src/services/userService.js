// Function to fetch all users
export const fetchUsers = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch users');
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Function to create a new user
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error('Failed to create user');
    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

// Function to update a user's role
export const updateUserRole = async (userId, role) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) throw new Error('Failed to update user role');
    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Error updating user role:', error);
    return null;
  }
};

// Function to delete a user
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete user');
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};
