import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://rajshreepress.runasp.net/ProductCategories", {
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading Product Categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Product Categories</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <div className="categories-data">
          <h2>Categories List</h2>
          {categories.map((category) => (
            <div key={category.id} className="category-item">
              <h3>{category.name}</h3>
              <p>
                Description:{" "}
                {category.description || "No description available"}
              </p>
              {category.imageUrl && (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  style={{ maxWidth: "200px" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
