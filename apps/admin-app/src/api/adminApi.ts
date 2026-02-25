import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (credentials: any) => {
    const { data } = await api.post('/api/login', credentials);
    if (data.token) {
        localStorage.setItem('admin_token', data.token);
    }
    return data;
};

export const logout = async () => {
    await api.post('/api/logout');
    localStorage.removeItem('admin_token');
};

export const getUser = async () => {
    const { data } = await api.get('/api/user');
    return data;
};

export const fetchMenuItems = async () => {
    const { data } = await api.get('/api/menu');
    return data;
};

export const saveMenuItem = async (id: number | null, itemData: any) => {
    if (id) {
        const { data } = await api.put(`/api/menu/${id}`, itemData);
        return data;
    }
    const { data } = await api.post('/api/menu', itemData);
    return data;
};

export const deleteMenuItem = async (id: number) => {
    const { data } = await api.delete(`/api/menu/${id}`);
    return data;
};

export const createCategory = async (name: string) => {
    const { data } = await api.post('/api/categories', { name });
    return data;
};

export const updateCategory = async (id: number, name: string) => {
    const { data } = await api.put(`/api/categories/${id}`, { name });
    return data;
};

export const deleteCategory = async (id: number) => {
    const { data } = await api.delete(`/api/categories/${id}`);
    return data;
};

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post('/api/upload-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data.path; // e.g. /storage/menu-images/xxxx.jpg
};

export const getAdmins = async () => {
    const { data } = await api.get('/api/admins');
    return data;
};

export const createAdmin = async (adminData: any) => {
    const { data } = await api.post('/api/admins', adminData);
    return data;
};

export const deleteAdmin = async (id: number) => {
    const { data } = await api.delete(`/api/admins/${id}`);
    return data;
};

export const updatePassword = async (passwordData: any) => {
    const { data } = await api.put('/api/user/password', passwordData);
    return data;
};

// Orders Management
export const fetchOrders = async (status?: string) => {
    const url = status ? `/api/orders?status=${status}` : '/api/orders';
    const { data } = await api.get(url);
    return data.data ?? data; // Unwrap paginated response
};

export const clearOrder = async (id: number) => {
    const { data } = await api.patch(`/api/orders/${id}/clear`);
    return data;
};

export const fetchAuditLogs = async () => {
    const { data } = await api.get('/api/audit-logs');
    return data.data ?? data; // Unwrap paginated response
};

export default api;
