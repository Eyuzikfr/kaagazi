import { useState } from "react";
import { Link } from "react-router-dom";

export default function Categories({ categories }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <h2>Categories</h2>

      <input
        type="text"
        placeholder="Search category..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {filteredCategories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <p>{category.products.length} books</p>
          <Link to={`/categories/${category.id}`}>View Category</Link>
        </div>
      ))}
    </div>
  );
}
