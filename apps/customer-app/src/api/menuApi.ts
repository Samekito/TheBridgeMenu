import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Accept': 'application/json'
    }
});

export const fetchMenu = async () => {
    const { data } = await api.get('/api/menu');
    return data; // Array of categories with menuItems
};

export const submitOrder = async (orderData: any) => {
    const { data } = await api.post('/api/orders', orderData);
    return data;
};
