import { useState } from "react";
import CategoryForm from "../components/CategoryForm";
import ProductForm from "../components/ProductForm";
import CategoryList from "../components/CategoryList";
import "../css/Admin.css";

export default function Admin({ categories, setCategories }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function addCategory(name) {
    const newCategory = {
      id: Date.now(),
      name: name,
      products: [],
    };

    setCategories([...categories, newCategory]);
  }

  function deleteCategory(id) {
    setCategories(categories.filter((category) => category.id !== id));
  }

  function updateCategory(id, newName) {
    setCategories(
      categories.map((category) => {
        if (category.id === id) {
          return {
            ...category,
            name: newName,
          };
        }

        return category;
      }),
    );
  }

  function addProduct(name, author, price, description, categoryId) {
    const newProduct = {
      id: Date.now(),
      name: name,
      author: author,
      price: price,
      description: description,
    };

    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            products: [...category.products, newProduct],
          };
        }

        return category;
      }),
    );
  }
  return (
    <div className="adminPanelContainer">
      <h2>Admin Panel</h2>
      <div className="adminControlGrid">
        <div className="categoryControlCard">
          <CategoryForm onAddCategory={addCategory} />
          <h3>Search Category</h3>
          <input
            type="text"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="categoryControlCard">
          <ProductForm categories={categories} onAddProduct={addProduct} />
        </div>
      </div>

      <CategoryList
        categories={filteredCategories}
        onDeleteCategory={deleteCategory}
        onUpdateCategory={updateCategory}
        isAdmin={true}
      />
    </div>
  );
}
