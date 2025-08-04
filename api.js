// API functions for AgroCulture

// Base API URL - works for both local and production
const API_BASE_URL = (() => {
    // If running locally, use local server
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    // If deployed on Netlify, use the /api path (handled by redirects)
    return '/api';
})();

// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Set auth token in localStorage
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

// Remove auth token
function removeAuthToken() {
    localStorage.removeItem('authToken');
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth API functions
const authAPI = {
    async login(credentials) {
        return await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    async register(userData) {
        return await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async logout() {
        return await apiRequest('/auth/logout', {
            method: 'POST'
        });
    },

    async getProfile() {
        return await apiRequest('/auth/profile');
    }
};

// Products API functions
const productsAPI = {
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/products?${queryString}`);
    },

    async getProduct(id) {
        return await apiRequest(`/products/${id}`);
    },

    async createProduct(productData) {
        return await apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    },

    async updateProduct(id, productData) {
        return await apiRequest(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    },

    async deleteProduct(id) {
        return await apiRequest(`/products/${id}`, {
            method: 'DELETE'
        });
    }
};

// Orders API functions
const ordersAPI = {
    async getOrders() {
        return await apiRequest('/orders');
    },

    async createOrder(orderData) {
        return await apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    async updateOrderStatus(id, status) {
        return await apiRequest(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }
};

// Payments API functions
const paymentsAPI = {
    async createPaymentOrder(amount) {
        return await apiRequest('/payments/create-order', {
            method: 'POST',
            body: JSON.stringify({ amount })
        });
    },

    async verifyPayment(paymentData) {
        return await apiRequest('/payments/verify', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }
};
