import React from "react";
import { useNavigate } from "react-router-dom";
import "./CardCategory.css";

const CardCategory = ({
  categoryImageUrl,
  categoryName,
  categoryDescription,
  categoryId,
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/products/category/${categoryId}`);
  };

  return (
    <div className="card-category-container">
      <div
        className="category-card"
        onClick={() => handleCategoryClick(categoryId)}
      >
        <div className="category-info">
          <div className="category-image">
            <img src={categoryImageUrl} alt={categoryName} />
          </div>
          <div className="basic-info">
            <h3>{categoryName}</h3>
            <p className="description">{categoryDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCategory;
