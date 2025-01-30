import { API_ENDPOINTS, API_HEADERS, IMAGE_CONFIG } from '../config/constants';

// Helper function to convert base64 to byte array
const base64ToByteArray = (base64String) => {
    const base64 = base64String.split(',')[1] || base64String;
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return Array.from(bytes);
};

// Get all images for a product
export const getProductImages = async (productId) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.PRODUCT_IMAGES}/${productId}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch product images');
        }
        
        const data = await response.json();
        return data.map(img => ({
            id: img.id,
            image: img.productsImage ? 
                (img.productsImage.startsWith('data:image') ? 
                    img.productsImage : 
                    `data:image/jpeg;base64,${img.productsImage}`
                ) : null,
            productId: img.productId
        }));
    } catch (error) {
        console.error('Error fetching product images:', error);
        throw error;
    }
};

// Add a new image to a product
export const addProductImage = async (productId, base64Data) => {
    try {
        debugger;
        var b = JSON.stringify({
            ProductId: parseInt(productId),
            Image: base64Data // Send the base64 data directly without any prefix
        });
        var d = `${API_ENDPOINTS.PRODUCT_IMAGES}`;
        const response = await fetch(`${API_ENDPOINTS.PRODUCT_IMAGES}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                ProductId: parseInt(productId),
                ProductsImage: base64Data // Send the base64 data directly without any prefix
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Upload response error:', errorData);
            throw new Error('Failed to upload image');
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

// Update an existing product image
export const updateProductImage = async (id, imageData, productId) => {
    try {
        const dataToSend = {
            Id: id,
            ProductsImage: imageData.split(',')[1],
            ProductId: parseInt(productId)
        };

        const response = await fetch(API_ENDPOINTS.PRODUCT_IMAGES, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Update response error:', errorData);
            throw new Error('Failed to update product image');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating product image:', error);
        throw error;
    }
};

// Delete a product image
export const deleteProductImage = async (imageId) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.PRODUCT_IMAGES}/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Delete response error:', errorData);
            throw new Error('Failed to delete image');
        }

        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}; 