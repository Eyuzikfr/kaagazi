import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Admin from "./pages/Admin";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./Orders";
import Wishlist from "./pages/Wishlist";
import PaymentSuccess from "./pages/PaymentSuccess";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import "./css/App.css";

function App() {
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const navigate = useNavigate();

  function addToCart(product) {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item._id === product._id,
      );

      if (existingProduct) {
        return currentCart.map((item) => {
          if (item._id === product._id) {
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

  function removeFromCart(productId) {
    setCart(cart.filter((item) => item._id !== productId));
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

  function addToWishlist(product) {
    setWishlist((currentWishlist) => {
      const existingProduct = currentWishlist.find(
        (item) => item._id === product._id,
      );

      if (!existingProduct) {
        return [...currentWishlist, product];
      }

      return currentWishlist;
    });
  }

  function removeFromWishlist(productId) {
    setWishlist(wishlist.filter((item) => item._id !== productId));
  }

  function moveToWishlist(product) {
    addToWishlist(product);
    removeFromCart(product._id);
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
            <Link className="navLink" to="/wishlist">
              Wishlist
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
          element={
            <Shop
              categories={categories}
              addToCart={addToCart}
              addToWishlist={addToWishlist}
            />
          }
        />

        <Route
          path="/categories"
          element={<Categories categories={categories} />}
        />

        <Route
          path="/categories/:categoryId"
          element={<CategoryProducts categories={categories} />}
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              moveToWishlist={moveToWishlist}
            />
          }
        />

        <Route
          path="/checkout"
          element={<Checkout cart={cart} placeOrder={placeOrder} />}
        />

        <Route path="/orders" element={<Orders orders={orders} />} />

        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              removeFromWishlist={removeFromWishlist}
              addToCart={addToCart}
            />
          }
        />

        <Route path="/payment/success" element={<PaymentSuccess />} />

        <Route
          path="/products/:id"
          element={
            <ProductDetails
              addToCart={addToCart}
              addToWishlist={addToWishlist}
            />
          }
        />

        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
