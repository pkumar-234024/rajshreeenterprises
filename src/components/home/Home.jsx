import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../data/productData";
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
        setIsLoading(true);
        const productsData = await getAllProducts(selectedCategory);
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
        <h2 className="products-title">
          {`Products in ${
            staticCategories.find((cat) => cat.id === selectedCategory)?.name
          }`}
        </h2>
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={`product-${product.id}`} className="product-card">
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
                    <p className="product-price">₹{product.price}</p>
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
    </div>
  );
};

export default Home;
