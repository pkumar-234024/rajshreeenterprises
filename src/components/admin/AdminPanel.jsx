import React, { useState, useEffect } from "react";
import "./AdminPanel.css";
import {
  getAllCategories,
  deleteCategory,
  updateCategory,
  createCategory,
  categoryData,
} from "../../data/categoryData";
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  getProductById,
} from "../../data/productData";
import { galleryData } from "../../data/galleryData";
import {
  getProductImages,
  addProductImage,
  deleteProductImage as deleteProductImageApi,
} from "../../data/productImagesData";
import Loader from "../common/Loader";
import { FaRing, FaCross, FaBaby, FaImages } from "react-icons/fa";
import {
  getAdminCredentials,
  updateAdminCredentials,
} from "../../data/adminCredentials";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("category");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [tabLoading, setTabLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showProductImagesModal, setShowProductImagesModal] = useState(false);
  const [selectedProductImages, setSelectedProductImages] = useState([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [credentialsForm, setCredentialsForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category: "",
    image: null,
  });

  const [selectedCategory, setSelectedCategory] = useState(1); // Default to Wedding (ID: 1)

  // Add this new state for optimistic updates
  const [isDeleting, setIsDeleting] = useState({});

  // Add static categories definition
  const staticCategories = [
    {
      id: 1,
      name: "Wedding Cards",
      description: "Beautiful wedding invitations",
      icon: <FaRing />,
      color: "#FF4B91",
    },
    {
      id: 2,
      name: "Death Cards",
      description: "Remembrance and condolence cards",
      icon: <FaCross />,
      color: "#4F4A45",
    },
    {
      id: 3,
      name: "Birth Cards",
      description: "Birth announcements and celebrations",
      icon: <FaBaby />,
      color: "#7091F5",
    },
    {
      id: 4,
      name: "Posters",
      description: "Custom posters and prints",
      icon: <FaImages />,
      color: "#65B741",
    },
  ];

  // Fetch products when selected category changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategory) {
        try {
          setLoading(true);
          const productsData = await getAllProducts(selectedCategory);
          setProducts(productsData);
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Fetch product images only when gallery tab is active and a product is selected
  useEffect(() => {
    const fetchProductImages = async () => {
      if (activeTab === "gallery" && selectedProduct) {
        try {
          setLoading(true);
          const images = await getProductImages(selectedProduct.id);
          setProductImages(images);
        } catch (error) {
          console.error("Error loading product images:", error);
          setProductImages([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductImages();
  }, [activeTab, selectedProduct]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        // Your API call here
        // const response = await fetch('your-api-endpoint/admin-data');
        // const data = await response.json();
        // setAdminData(data);

        // Simulating API call with timeout
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  // Category handlers
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) {
      alert("Category name is required!");
      return;
    }

    const submitData = async (imageData) => {
      try {
        setActionLoading(true);
        const categoryData = {
          name: categoryForm.name,
          description: categoryForm.description,
          image: imageData,
        };

        let response;
        if (editingCategory) {
          response = await updateCategory(editingCategory.id, categoryData);
        } else {
          response = await createCategory(categoryData);
        }

        if (response) {
          // Refresh categories list
          const updatedCategories = await getAllCategories();
          setCategories(updatedCategories);

          setShowCategoryForm(false);
          setEditingCategory(null);
          setCategoryForm({ name: "", description: "", image: null });
          alert(
            editingCategory
              ? "Category updated successfully"
              : "Category created successfully"
          );
        } else {
          throw new Error("Failed to save category");
        }
      } catch (error) {
        console.error("Error submitting category:", error);
        alert(
          `Failed to ${
            editingCategory ? "update" : "create"
          } category. Please try again.`
        );
      } finally {
        setActionLoading(false);
      }
    };

    if (categoryForm.image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        submitData(reader.result);
      };
      reader.onerror = () => {
        alert("Error reading file. Please try again.");
      };
      reader.readAsDataURL(categoryForm.image);
    } else {
      // If no new image is selected, use existing image
      submitData(categoryForm.image);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      image: category.image,
    });
    setShowCategoryForm(true);
  };

  // Product handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category) {
      alert("Product name and category are required!");
      return;
    }

    const submitProduct = async (imageData) => {
      try {
        setActionLoading(true);
        const productData = {
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          image: imageData,
          categoryId: parseInt(productForm.category),
        };

        let response;
        if (editingProduct) {
          response = await updateProduct(editingProduct.id, productData);
        } else {
          response = await createProduct(productData);
        }

        if (response) {
          // Refresh products list
          const updatedProducts = await getAllProducts(productData.categoryId);
          setProducts(updatedProducts);

          setShowProductForm(false);
          setEditingProduct(null);
          setProductForm({
            name: "",
            description: "",
            category: "",
            price: "",
            image: null,
          });
          alert(
            editingProduct
              ? "Product updated successfully"
              : "Product created successfully"
          );
        } else {
          throw new Error("Failed to save product");
        }
      } catch (error) {
        console.error("Error submitting product:", error);
        alert(
          `Failed to ${
            editingProduct ? "update" : "create"
          } product. Please try again.`
        );
      } finally {
        setActionLoading(false);
      }
    };

    if (productForm.image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        submitProduct(reader.result);
      };
      reader.onerror = () => {
        alert("Error reading file. Please try again.");
      };
      reader.readAsDataURL(productForm.image);
    } else {
      // If no new image is selected, use existing image
      submitProduct(productForm.image);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.categoryId.toString(),
      images: product.images,
    });
    setShowProductForm(true);
  };

  // Update the handleDeleteProduct function with optimistic updates
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Optimistically update UI
        setIsDeleting((prev) => ({ ...prev, [id]: true }));

        // Optimistically remove the product from the list
        const currentCategoryId =
          selectedCategory || products.find((p) => p.id === id)?.categoryId;

        if (!currentCategoryId) {
          throw new Error("Category ID not found");
        }

        // Optimistically update the UI
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );

        // Make the API call
        await deleteProduct(id);

        // Only fetch new data if the delete was successful
        const updatedProducts = await getAllProducts(currentCategoryId);
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");

        // Revert the optimistic update on error
        const updatedProducts = await getAllProducts(currentCategoryId);
        setProducts(updatedProducts);
      } finally {
        setIsDeleting((prev) => ({ ...prev, [id]: false }));
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        setActionLoading(true);
        await deleteCategory(id);
        // After successful deletion, refresh the categories list
        const updatedCategories = await getAllCategories();
        setCategories(updatedCategories);
        alert("Category deleted successfully");
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please try again.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleCategoryImageUpload = (e) => {
    const file = e.target.files[0];
    setCategoryForm({ ...categoryForm, image: file });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProductForm({ ...productForm, image: file });
  };

  const handleAdditionalImagesUpload = async (e) => {
    debugger;
    const files = Array.from(e.target.files);

    if (!selectedProduct || files.length === 0) {
      alert("Please select a product and images first!");
      return;
    }

    try {
      setActionLoading(true);

      for (const file of files) {
        const reader = new FileReader();
        try {
          const base64Image = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
          });

          // Extract only the base64 data without the data:image prefix
          const base64Data = base64Image.split(",")[1];

          await addProductImage(selectedProduct.id, base64Data);
        } catch (error) {
          debugger;
          console.error("Error processing image:", error);
          alert(`Failed to upload image: ${file.name}`);
        }
      }

      // Refresh the images list after successful upload
      const updatedImages = await getProductImages(selectedProduct.id);
      setProductImages(updatedImages);

      // Clear the file input
      e.target.value = "";
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error uploading images. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProductImage = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        setActionLoading(true);
        await deleteProductImageApi(imageId);

        // Refresh images after deletion
        if (selectedProduct) {
          const updatedImages = await getProductImages(selectedProduct.id);
          setProductImages(updatedImages);
        }

        alert("Image deleted successfully");
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete image. Please try again.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Update the tab change handler
  const handleTabChange = async (tab) => {
    try {
      setTabLoading(true);
      setActiveTab(tab);

      // Clear data when switching tabs
      if (tab === "category") {
        setProducts([]);
        setProductImages([]);
        setSelectedProduct(null);
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } else if (tab === "product") {
        setProductImages([]);
        setSelectedProduct(null);
        if (categories.length > 0) {
          const productsData = await getAllProducts(categories[0].id);
          setProducts(productsData);
        }
      } else if (tab === "gallery") {
        // Load initial gallery data if needed
      }
    } catch (error) {
      console.error("Error switching tabs:", error);
    } finally {
      setTabLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleGalleryModal = (product) => {
    setSelectedProduct(product);
    setShowGalleryModal(true);
    fetchProductImages(product.id);
  };

  const fetchProductImages = async (productId) => {
    try {
      setActionLoading(true);
      const images = await getProductImages(productId);
      setProductImages(images);
    } catch (error) {
      console.error("Error loading product images:", error);
      setProductImages([]);
    } finally {
      setActionLoading(false);
    }
  };

  const handleProductCardClick = async (product) => {
    try {
      setActionLoading(true);
      const images = await getProductImages(product.id);
      setSelectedProduct(product);
      setSelectedProductImages(images);
      setShowProductImagesModal(true);
    } catch (error) {
      console.error("Error loading product images:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();

    if (credentialsForm.password !== credentialsForm.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      updateAdminCredentials({
        username: credentialsForm.username,
        password: credentialsForm.password,
      });
      alert("Admin credentials updated successfully!");
      setShowSettingsModal(false);
    } catch (error) {
      console.error("Error updating credentials:", error);
      alert("Failed to update credentials");
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-content">
        {(loading || tabLoading || actionLoading) && <Loader />}

        {/* Categories Section */}
        <div className="categories-navbar">
          {staticCategories.map((category) => (
            <button
              key={`category-${category.id}`}
              className={`category-nav-button ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category.id)}
              style={{
                "--category-color": category.color,
              }}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Products Section */}
        <div className="product-management">
          <div className="product-header">
            <h2>
              Products in{" "}
              {
                staticCategories.find((cat) => cat.id === selectedCategory)
                  ?.name
              }
            </h2>
            <button
              className="add-btn"
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: "",
                  description: "",
                  category: selectedCategory.toString(),
                  price: "",
                  image: null,
                });
                setShowProductForm(true);
              }}
            >
              + Add Product
            </button>
          </div>

          <div className="items-list">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={`product-${product.id}`}
                  className="item-card"
                  onClick={() => handleProductCardClick(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="item-thumbnail"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="item-info">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    {product.price && (
                      <p className="product-price">₹{product.price}</p>
                    )}
                  </div>
                  <div
                    className="item-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="edit-btn"
                      onClick={() => handleEditProduct(product)}
                      disabled={isDeleting[product.id]}
                    >
                      Edit
                    </button>
                    <button
                      className="manage-images-btn"
                      onClick={() => handleGalleryModal(product)}
                    >
                      Manage Images
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={isDeleting[product.id]}
                    >
                      {isDeleting[product.id] ? (
                        <span className="button-loader"></span>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">
                <p>No products available in this category</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Form Modal */}
        {showCategoryForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <form onSubmit={handleCategorySubmit} className="admin-form">
                <div className="modal-header">
                  <h2>
                    {editingCategory ? "Edit Category" : "Create Category"}
                  </h2>
                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setShowCategoryForm(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="form-group">
                  <label htmlFor="categoryName">Category Name *</label>
                  <input
                    id="categoryName"
                    type="text"
                    placeholder="Category Name"
                    value={categoryForm.name}
                    required
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="categoryImage">Category Image *</label>
                  <input
                    id="categoryImage"
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleCategoryImageUpload}
                  />
                  {categoryForm.image && (
                    <div className="image-preview single-preview">
                      <img
                        src={
                          categoryForm.image instanceof File
                            ? URL.createObjectURL(categoryForm.image)
                            : categoryForm.image
                        }
                        alt="Category preview"
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="categoryDescription">
                    Category Description
                  </label>
                  <textarea
                    id="categoryDescription"
                    placeholder="Category Description"
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-actions">
                  <button type="submit">
                    {editingCategory ? "Update Category" : "Create Category"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <form onSubmit={handleProductSubmit} className="admin-form">
                <div className="modal-header">
                  <h2>{editingProduct ? "Edit Product" : "Create Product"}</h2>
                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setShowProductForm(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="form-group">
                  <label htmlFor="productName">Product Name *</label>
                  <input
                    id="productName"
                    type="text"
                    placeholder="Product Name"
                    value={productForm.name}
                    required
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="productDescription">Description</label>
                  <textarea
                    id="productDescription"
                    placeholder="Product Description"
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="productPrice">Price *</label>
                  <input
                    id="productPrice"
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={productForm.price}
                    required
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="productCategory">Category *</label>
                  <select
                    id="productCategory"
                    value={productForm.category}
                    required
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Category</option>
                    {staticCategories.map((category) => (
                      <option
                        key={`category-${category.id}`}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="productImages">Product Image</label>
                  <input
                    id="productImages"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {productForm.image && (
                    <div className="image-preview">
                      <div className="preview-item">
                        <img
                          src={
                            productForm.image instanceof File
                              ? URL.createObjectURL(productForm.image)
                              : productForm.image
                          }
                          alt="Product preview"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit">
                    {editingProduct ? "Update Product" : "Create Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showGalleryModal && (
          <div className="modal-overlay">
            <div className="modal-content gallery-modal">
              <div className="modal-header">
                <h2>Manage Images for {selectedProduct?.name}</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowGalleryModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="gallery-content">
                <div className="upload-section">
                  <h3>Add More Images</h3>
                  <div className="upload-container">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleAdditionalImagesUpload}
                      className="file-input"
                    />
                    <p className="upload-hint">
                      Select multiple images to add to {selectedProduct?.name}
                    </p>
                  </div>
                </div>

                <div className="gallery-grid">
                  {productImages.length > 0 ? (
                    productImages.map((image) =>
                      image && image.image ? (
                        <div key={image.id} className="gallery-item">
                          <img
                            src={image.image}
                            alt={`Product ${selectedProduct?.name}`}
                            onError={(e) => {
                              console.error("Image failed to load:", image);
                              e.target.onerror = null;
                              e.target.src = "/placeholder-image.jpg";
                            }}
                          />
                          <div className="gallery-item-actions">
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteProductImage(image.id)}
                              disabled={actionLoading}
                            >
                              {actionLoading ? (
                                <span className="button-loader"></span>
                              ) : (
                                "Delete"
                              )}
                            </button>
                          </div>
                        </div>
                      ) : null
                    )
                  ) : (
                    <div className="no-images">
                      <p>No additional images available for this product</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showProductImagesModal && (
          <div className="modal-overlay">
            <div className="modal-content product-images-modal">
              <div className="modal-header">
                <h2>{selectedProduct?.name} - All Images</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowProductImagesModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="product-images-grid">
                {selectedProductImages.length > 0 ? (
                  selectedProductImages.map((image, index) => (
                    <div
                      key={`image-${image.id || index}`}
                      className="product-image-item"
                    >
                      <img
                        src={image.image}
                        alt={`${selectedProduct?.name} - Image ${index + 1}`}
                        onError={(e) => {
                          console.error("Image failed to load:", image);
                          e.target.onerror = null;
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="no-images">
                    <p>No additional images available for this product</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showSettingsModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Admin Settings</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowSettingsModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCredentialsSubmit} className="admin-form">
                <div className="form-group">
                  <label htmlFor="adminUsername">Username</label>
                  <input
                    type="text"
                    id="adminUsername"
                    value={credentialsForm.username}
                    onChange={(e) =>
                      setCredentialsForm({
                        ...credentialsForm,
                        username: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="adminPassword">New Password</label>
                  <input
                    type="password"
                    id="adminPassword"
                    value={credentialsForm.password}
                    onChange={(e) =>
                      setCredentialsForm({
                        ...credentialsForm,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={credentialsForm.confirmPassword}
                    onChange={(e) =>
                      setCredentialsForm({
                        ...credentialsForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Update Credentials
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowSettingsModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
