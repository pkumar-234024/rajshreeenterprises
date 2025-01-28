import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ImageCard.css";

const ImageCard = ({
  id,
  imageUrl,
  title,
  description,
  price,
  dimensions,
  color,
  type,
  categoryId
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="image-card" onClick={handleClick}>
      <div className="image-container">
        <img src={imageUrl} alt={title} />
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ImageCard;
