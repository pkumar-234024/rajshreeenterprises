import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllProducts, getProductById } from "../../data/productData";
import { getAllCategories, getCategoryById } from "../../data/categoryData";
import "./ProductListing.css";
import ImageCard from "../imagecard/ImageCard";

const ProductListing = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get category details
        const category = await getCategoryById(categoryId);
        if (category) {
          setCategoryName(category.categoryName);

          // Get products for this category
          const productsData = await getAllProducts(categoryId);
          setProducts(productsData);
        } else {
          setError("Category not found");
          setProducts([]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      loadProducts();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>{error}</h2>
        <button onClick={() => navigate("/")}>Go Back to Categories</button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-products">
        <h2>No products found for this category</h2>
        <button onClick={() => navigate("/")}>Go Back to Categories</button>
      </div>
    );
  }

  return (
    <div className="product-listing">
      <h2 className="category-title">{categoryName} Collection</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ImageCard
            key={product.id}
            id={product.id}
            imageUrl={product.image} // Using the single image from API
            title={product.name}
            description={product.description}
            categoryId={product.categoryId}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductListing;
