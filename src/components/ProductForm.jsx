import { useState } from "react";

function ProductForm({ categories, onAddProduct }) {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (
      name.trim() === "" ||
      author.trim() === "" ||
      price === "" ||
      description.trim() === "" ||
      categoryId === ""
    ) {
      return;
    }

    onAddProduct(name, author, Number(price), description, Number(categoryId));

    setName("");
    setAuthor("");
    setPrice("");
    setDescription("");
    setCategoryId("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Product</h3>

      <input
        type="text"
        placeholder="Book name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />
      <br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      ></textarea>
      <br />

      <select
        value={categoryId}
        onChange={(event) => setCategoryId(event.target.value)}
      >
        <option value="">Select Category</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <br />

      <button type="submit">Add Product</button>
    </form>
  );
}

export default ProductForm;
