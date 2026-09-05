import { useState } from "react";

function CategoryForm({ onAddCategory }) {
  const [name, setName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (name.trim() === "") {
      return;
    }

    onAddCategory(name);

    setName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Category</h2>
      <input
        type="text"
        placeholder="Category name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <button type="submit">Add Category</button>
    </form>
  );
}

export default CategoryForm;
