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
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

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

  useEffect(() => {
    async function loadCart() {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to load cart:", data);
        return;
      }

      const cartItems = [];

      for (const item of data.items) {
        const productResponse = await fetch(
          `http://localhost:5000/api/products/${item.productId}`,
        );

        const product = await productResponse.json();

        cartItems.push({
          ...product,
          quantity: item.quantity,
        });
      }

      setCart(cartItems);
    }

    loadCart();
  }, [isLoggedIn]);

  const navigate = useNavigate();

  async function addToCart(product) {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product._id,
        quantity: 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Add to cart failed:", data);
      return;
    }

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

  async function removeFromCart(productId) {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/cart/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Remove from cart failed:", data);
      return;
    }

    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== productId),
    );
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

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
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

            {isLoggedIn ? (
              <button onClick={logout} className="navLink">
                Logout
              </button>
            ) : (
              <Link className="navLink" to="/login">
                Login
              </Link>
            )}
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

        <Route path="/login" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </div>
  );
}

export default App;
