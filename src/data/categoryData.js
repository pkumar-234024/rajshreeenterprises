import { API_ENDPOINTS, API_HEADERS, IMAGE_CONFIG } from '../config/constants';
import masterImage from '../assets/cardCategory/wedding-cat.jfif';

//const API_URL = 'http://rajshreepress.runasp.net/ProductCategories';
const API_URL = 'https://rajshreepress.runasp.net/ProductCategories';

// Helper function to convert base64 to byte array
const base64ToByteArray = (base64String) => {
    // Remove data URL prefix if present
    const base64 = base64String.split(',')[1] || base64String;
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return Array.from(bytes);
};

// Initial categories data
const initialCategories = [
    {
        id: 1,
        name: "Wedding Cards",
        description: "Beautiful wedding invitation cards",
        image: masterImage
    }
];

// Export initial categories data
export const categoryData = () => initialCategories;

// Fetch all categories
export const getAllCategories = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.CATEGORIES, {
            headers: API_HEADERS
        });
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        return data.map(category => ({
            id: category.id,
            name: category.categoryName,
            description: category.categoryDescription,
            image: `${IMAGE_CONFIG.BASE64_PREFIX}${category.categoryImage}`
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return initialCategories;
    }
};

// Create a new category
export const createCategory = async (categoryData) => {
    try {
        // Prepare the data to send in the correct format
        const dataToSend = {
            Id: 0, // API will assign the real ID
            CategoryName: categoryData.name,
            CategoryDescription: categoryData.description,
            CategoryImage: categoryData.image.split(',')[1] // Remove the data:image/jpeg;base64, prefix
        };
        console.log(dataToSend);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Create response error:', errorData);
            throw new Error('Failed to create category');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

// Update an existing category
export const updateCategory = async (id, categoryData) => {
    try {
        // Prepare the data to send in the correct format
        const dataToSend = {
            Id: id,
            CategoryName: categoryData.name,
            CategoryDescription: categoryData.description,
            CategoryImage: categoryData.image.split(',')[1] // Remove the data:image/jpeg;base64, prefix
        };

        const response = await fetch(`${API_URL}`, {
            method: 'Patch', // Changed from PATCH to PUT as that's more common for full updates
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Update response error:', errorData);
            throw new Error('Failed to update category');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

// Delete a category
export const deleteCategory = async (id) => {
    try {
        console.log(`${API_URL}/${id}`);
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }) // Add request body with ID
        });

        // Log the response for debugging
        console.log('Delete response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Delete response error:', errorData);
            throw new Error(`Failed to delete category: ${JSON.stringify(errorData)}`);
        }

        const result = await response.json().catch(() => true);
        return result;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};

// Get a single category by ID
export const getCategoryById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch category');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
}; 