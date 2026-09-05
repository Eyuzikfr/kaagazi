import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Admin from "./pages/Admin";
import Customer from "./pages/Shop";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import Cart from "./pages/Cart";

function App() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Fiction",
      products: [
        {
          id: 1,
          name: "1984",
          author: "George Orwell",
          description:
            "George Orwell's 1984 is a classic dystopian novel published in 1949 that warns against the terrifying dangers of totalitarianism, mass surveillance, and the manipulation of truth.",
          price: 500,
        },
        {
          id: 2,
          name: "The Alchemist",
          author: "Paulo Coelho",
          description:
            "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.",
          price: 450,
        },
      ],
    },
    {
      id: 2,
      name: "Programming",
      products: [
        {
          id: 3,
          name: "Clean Code",
          author: "Robert Cecil Martin",
          description:
            "Clean code is software source code that is easy to read, simple to understand, and simple to change over time.",
          price: 1200,
        },
        {
          id: 4,
          name: "The Pragmatic Programmer",
          author: "Andy Hunt and Dave Thomas",
          description:
            "The Pragmatic Programmer is a famous software development book written by Andrew Hunt and David Thomas.",
          price: 1500,
        },
      ],
    },
  ]);
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart((currentCart) => [...currentCart, product]);
  }

  return (
    <div>
      <h1>Kaagazi</h1>
      <p>Online Bookstore</p>

      <nav>
        <Link to="/admin">Admin Panel</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/cart">Cart</Link>
      </nav>

      <Routes>
        <Route
          path="/admin"
          element={
            <Admin categories={categories} setCategories={setCategories} />
          }
        />

        <Route
          path="/shop"
          element={<Customer categories={categories} addToCart={addToCart} />}
        />

        <Route
          path="/categories"
          element={<Categories categories={categories} />}
        />

        <Route
          path="/categories/:categoryId"
          element={<CategoryProducts categories={categories} />}
        />

        <Route path="/cart" element={<Cart cart={cart} />} />
      </Routes>
    </div>
  );
}

export default App;
