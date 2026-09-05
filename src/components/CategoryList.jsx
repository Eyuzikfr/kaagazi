import { useState } from "react";
import '../css/CategoryList.css';


export default function CategoryList({
  categories,
  onDeleteCategory,
  onUpdateCategory,
  isAdmin = false,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  function startEditing(category) {
    setEditingId(category.id);
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
      {categories.map((category) => (
        <div key={category.id}>
          {editingId === category.id ? (
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
              <h2>{category.name}</h2>
              {isAdmin && (
                <>
                  <button onClick={() => startEditing(category)}>Edit</button>
                  <button onClick={() => onDeleteCategory(category.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          )}

          <p>{category.products.length} books</p>
          <button>View Books</button>
        </div>
      ))}
    </div>
  );
}
