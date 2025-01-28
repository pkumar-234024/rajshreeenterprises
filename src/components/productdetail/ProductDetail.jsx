import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { productData } from "../../data/productData";
import { galleryData } from "../../data/galleryData";
import "./ProductDetail.css";
import Loader from "../common/Loader";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);

  const galleryImages = galleryData.filter(
    (img) => img.productId === parseInt(productId)
  );
  console.log(galleryImages);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        // Your API call here
        // const response = await fetch(`your-api-endpoint/product/${productId}`);
        // const data = await response.json();
        // setProduct(data);

        // Simulating API call with timeout
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handlePrevImage = () => {
    setSelectedImage((prev) =>
      prev === undefined
        ? galleryImages.length - 1
        : prev === 0
        ? galleryImages.length - 1
        : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev === undefined ? 0 : prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="no-product">
        <h2>Product not found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-left">
        <div className="main-image" {...swipeHandlers}>
          <button className="nav-button prev" onClick={handlePrevImage}>
            &lt;
          </button>
          <img
            src={galleryImages[selectedImage]?.url || product.image}
            alt={product.name}
          />
          <button className="nav-button next" onClick={handleNextImage}>
            &gt;
          </button>
        </div>
        <div className="thumbnail-container">
          {galleryImages.map((image, index) => (
            <img
              key={index}
              id={image.id}
              src={image.url}
              alt={`${product.name} view ${index + 1}`}
              className={selectedImage === index ? "selected" : ""}
              onClick={() => setSelectedImage(index)}
            />
          ))}
        </div>
      </div>

      <div className="product-detail-right">
        <h1>{product.name}</h1>
        <p className="price">₹{product.price}</p>
        <p className="description">{product.description}</p>
        <div className="product-specs">
          <div className="spec-item">
            <span>Dimensions:</span>
            <span>{product.dimensions}</span>
          </div>
          <div className="spec-item">
            <span>Color:</span>
            <span>{product.color}</span>
          </div>
          <div className="spec-item">
            <span>Type:</span>
            <span>{product.type}</span>
          </div>
        </div>
        <button className="back-button" onClick={() => navigate(-1)}>
          Back to Products
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
