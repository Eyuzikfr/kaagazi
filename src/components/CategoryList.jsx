import { useState } from "react";
import "../css/CategoryList.css";

export default function CategoryList({
  categories,
  onDeleteCategory,
  onUpdateCategory,
  isAdmin = false,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  function startEditing(category) {
    setEditingId(category._id);
    setEditName(category.name);
  }

  function handleSave(event) {
    event.preventDefault();

    if (editName.trim() === "") return;

    onUpdateCategory(editingId, editName);

    setEditingId(null);
    setEditName("");
  }

  return (
    <div>
      <h2>Categories</h2>
      {categories.map((category) => (
        <div key={category._id}>
          {editingId === category._id ? (
            <form onSubmit={handleSave}>
              <input
                type="text"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
              />
              <button type="submit">Save</button>
            </form>
          ) : (
            <div className="flex">
              <h3>{category.name}</h3>
              {isAdmin && (
                <>
                  <button onClick={() => startEditing(category)}>Edit</button>
                  <button onClick={() => onDeleteCategory(category._id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          )}

          {/* <p>{category.products?.length || 0} books</p> */}
          <button>View Books</button>
        </div>
      ))}
    </div>
  );
}
