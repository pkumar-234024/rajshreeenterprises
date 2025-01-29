import { API_ENDPOINTS, API_HEADERS, IMAGE_CONFIG } from '../config/constants';
import masterImage from '../assets/weddingcard/images.jfif';

const API_URL = 'https://rajshreepress.runasp.net/Product';

// Fetch all products by category ID
export const getAllProducts = async (categoryId) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${categoryId}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        return data.map(product => ({
            id: product.id,
            name: product.productName,
            description: product.productsDescription,
            image: `${IMAGE_CONFIG.BASE64_PREFIX}${product.productsImage}`,
            categoryId: product.productCategoryId
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Create a new product
export const createProduct = async (productData) => {
    try {
        const dataToSend = {
            Id: 0,
            ProductName: productData.name,
            ProductsDescription: productData.description,
            ProductsImage: productData.image.split(',')[1],
            ProductCategoryId: parseInt(productData.categoryId)
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Create response error:', errorData);
            throw new Error('Failed to create product');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// Update an existing product
export const updateProduct = async (id, productData) => {
    try {
        const dataToSend = {
            Id: id,
            ProductName: productData.name,
            ProductsDescription: productData.description,
            ProductsImage: productData.image.split(',')[1],
            ProductCategoryId: parseInt(productData.categoryId)
        };

        const response = await fetch(`${API_URL}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Update response error:', errorData);
            throw new Error('Failed to update product');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

// Delete a product
export const deleteProduct = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Delete response error:', errorData);
            throw new Error(`Failed to delete product: ${JSON.stringify(errorData)}`);
        }

        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// Get a single product by ID
export const getProductById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }
        const product = await response.json();
        return {
            id: product.id,
            name: product.productName,
            description: product.productsDescription,
            image: `data:image/jpeg;base64,${product.productsImage}`,
            categoryId: product.productCategoryId
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

// These functions are kept for backward compatibility
export const addProductImages = async (productId, newImages) => {
    // This functionality might need to be implemented differently based on your API
    console.warn('addProductImages needs to be implemented according to API specifications');
    return false;
};

export const deleteProductImage = async (productId, imageIndex) => {
    // This functionality might need to be implemented differently based on your API
    console.warn('deleteProductImage needs to be implemented according to API specifications');
    return false;
};

export const productData = [];