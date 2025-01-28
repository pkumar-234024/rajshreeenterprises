import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories, categoryData } from "../../data/categoryData";
import CardCategory from "../cardcategory/CardCategory";
import "./Home.css";
import Loader from "../common/Loader";

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(categoryData());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await getAllCategories();
        //console.log(fetchedCategories);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to initial categories if API fails
        setCategories(categoryData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h2 className="category-title">Our Print Categories</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <CardCategory
            key={category.id}
            categoryImageUrl={category.image}
            categoryName={category.name}
            categoryDescription={category.description}
            categoryId={category.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
