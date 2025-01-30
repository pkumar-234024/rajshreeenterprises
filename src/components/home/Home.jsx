import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../data/productData";
import { getProductImages } from "../../data/productImagesData";
import "./Home.css";
import Loader from "../common/Loader";
// Import icons from react-icons
import {
  FaRing, // Wedding icon
  FaCross, // Death/Memorial icon
  FaBaby, // Birth icon
  FaImages, // Poster icon
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1); // Default to Wedding (ID: 1)
  const [isLoading, setIsLoading] = useState(true);
  // Add these new states
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);

  // Static categories with icons
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
      try {
        debugger;
        setIsLoading(true);
        const productsData = await getAllProducts(selectedCategory);
        console.log(productsData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Add this new function to handle product click
  const handleProductClick = async (product) => {
    try {
      setIsLoading(true);
      const images = await getProductImages(product.id);
      setSelectedProduct(product);
      setProductImages(images);
      setShowProductModal(true);
    } catch (error) {
      console.error("Error loading product images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="home-container">
      <div className="categories-navbar">
        {staticCategories.map((category) => (
          <button
            key={`category-${category.id}`}
            className={`category-nav-button ${
              selectedCategory === category.id ? "active" : ""
            }`}
            onClick={() => handleCategorySelect(category.id)}
            style={{
              "--category-color": category.color,
            }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-section">
        {/* <h2 className="products-title">
          {`Products in ${
            staticCategories.find((cat) => cat.id === selectedCategory)?.name
          }`}
        </h2> */}
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={`product-${product.id}`}
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-thumbnail"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  {product.price && (
                    <p className="product-price">₹{product.price} /card</p>
                  )}
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

      {/* Product Images Modal */}
      {showProductModal && selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => setShowProductModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProduct.name}</h2>
              <button
                className="close-btn"
                onClick={() => setShowProductModal(false)}
              >
                ×
              </button>
            </div>
            <div className="product-images-grid">
              {/* Show main product image first */}
              <div className="product-image-item">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>
              {/* Show additional images */}
              {productImages.map((image, index) => (
                <div
                  key={`image-${image.id || index}`}
                  className="product-image-item"
                >
                  <img
                    src={image.image}
                    alt={`${selectedProduct.name} - Image ${index + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
