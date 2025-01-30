// Store admin credentials
let adminCredentials = {
    username: "admin",
    password: "admin"
};

// Get admin credentials
export const getAdminCredentials = () => {
    // Get credentials from localStorage if they exist
    const storedCredentials = localStorage.getItem('adminCredentials');
    if (storedCredentials) {
        adminCredentials = JSON.parse(storedCredentials);
    }
    return adminCredentials;
};

// Update admin credentials
export const updateAdminCredentials = (newCredentials) => {
    adminCredentials = {
        ...adminCredentials,
        ...newCredentials
    };
    // Store in localStorage
    localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
    return adminCredentials;
};

// Reset admin credentials to default
export const resetAdminCredentials = () => {
    const defaultCredentials = {
        username: "admin",
        password: "admin"
    };
    localStorage.setItem('adminCredentials', JSON.stringify(defaultCredentials));
    adminCredentials = defaultCredentials;
    return defaultCredentials;
}; 