import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Admin from "./pages/Admin";
import Customer from "./pages/Shop";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import Cart from "./pages/Cart";
import Checkout from "./Checkout";
import Orders from "./Orders";
import "./css/App.css";

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
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  function addToCart(product) {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id,
      );

      if (existingProduct) {
        return currentCart.map((item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  }

  function placeOrder() {
    const newOrder = {
      id: Date.now(),
      items: cart,
    };

    setOrders((oldOrders) => [...oldOrders, newOrder]);

    setCart([]);

    navigate("/orders");
  }

  return (
    <div>
      <div className="headerContainer">
        <header>
          <div className="logo">
            <h1>Kaagazi</h1>
            <p>Online Bookstore</p>
          </div>
          <nav>
            <Link className="navLink" to="/admin">
              Admin Panel
            </Link>
            <Link className="navLink" to="/shop">
              Shop
            </Link>
            <Link className="navLink" to="/categories">
              Categories
            </Link>
            <Link className="navLink" to="/cart">
              Cart
            </Link>
          </nav>
        </header>
      </div>
      <hr />

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

        <Route
          path="/checkout"
          element={<Checkout cart={cart} placeOrder={placeOrder} />}
        />

        <Route path="/orders" element={<Orders orders={orders} />} />
      </Routes>
    </div>
  );
}

export default App;
