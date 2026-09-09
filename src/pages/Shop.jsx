import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/App.css";
// import CategoryList from "../components/CategoryList";

export default function Shop({ categories, addToCart, addToWishlist }) {
  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  });

  const handleCategoryChange = async (event) => {
    const categoryId = event.target.value;

    // setSelectedCategory(categoryId);

    if (categoryId === "all") {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();

      setProducts(data);
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/products?categoryId=${categoryId}`,
    );

    const data = await response.json();

    setProducts(data);
  };

  return (
    <div>
      <h2>Customer Panel</h2>

      <select onChange={handleCategoryChange}>
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      <div className="productGrid">
        {products.map((product) => (
          <div key={product._id} className="productCard">
            <h3>{product.title}</h3>
            <p>{product.author}</p>
            <p>Rs. {product.price}</p>

            <Link to={`/products/${product._id}`}>View Details</Link>

            <button onClick={() => addToCart(product)}>Add To Cart</button>

            <button onClick={() => addToWishlist(product)}>
              Add To Wishlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
