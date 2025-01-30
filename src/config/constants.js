import { API_BASE_URL as DEV_API_URL } from './constants.dev';
import { API_BASE_URL as PROD_API_URL } from './constants.prod';

export const API_BASE_URL = "https://rajshreepress.runasp.net";

// API Endpoints
export const API_ENDPOINTS = {
    CATEGORIES: `${API_BASE_URL}/ProductCategories`,
    PRODUCTS: `${API_BASE_URL}/Product`,
    PRODUCT_IMAGES: `${API_BASE_URL}/ProductImage`,
};

// Common Headers
export const API_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

// Other constants
export const IMAGE_CONFIG = {
    MAX_SIZE: 5242880, // 5MB in bytes
    ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    BASE64_PREFIX: 'data:image/jpeg;base64,'
}; 