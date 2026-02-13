import { User } from '@/types';
import axios from 'axios';

const API_URL = '  https://convenient-inequitably-hermelinda.ngrok-free.dev';

const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data as User[];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const getUserById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

const createUser = async (user: User) => {
  try {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const updateUser = async (id: number, user: User) => {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

const deleteUser = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/users/${id}`);
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
