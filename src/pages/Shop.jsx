import { useState } from "react";
import "../App.css";
// import CategoryList from "../components/CategoryList";


export default function Customer({ categories }) {
  // const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = categories.flatMap((category) => category.products);

  const selectedCategoryData = categories.find(
    (category) => category.id === Number(selectedCategory),
  );

  const filteredProducts =
    selectedCategory === "all" ? products : selectedCategoryData.products;

  return (
    <div>
      <h2>Customer Panel</h2>

      <select onChange={(event) => setSelectedCategory(event.target.value)}>
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <div className="productGrid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="productCard">
            <h3>{product.name}</h3>
            <p>{product.author}</p>
            <p>Rs. {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
