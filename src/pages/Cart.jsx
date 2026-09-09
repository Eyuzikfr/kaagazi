import { Link } from "react-router-dom";
import "../css/Cart.css";

export default function Cart({ cart, removeFromCart, moveToWishlist }) {
  const totalItems = cart.reduce((total, item) => {
    total += item.quantity;
    return total;
  }, 0);

  const totalCost = cart.reduce((total, item) => {
    total += item.price * item.quantity;
    return total;
  }, 0);

  return cart.length > 0 ? (
    <div>
      <h2>Your Cart</h2>
      <ol className="cartList">
        {cart.map((product) => (
          <li key={product._id}>
            <p>
              {product.title} - {product.author}
            </p>
            <p>Rs. {product.price}</p>
            <p>x {product.quantity}</p>
            <button onClick={() => removeFromCart(product._id)}>Remove</button>
            <button onClick={() => moveToWishlist(product)}>
              Move to wishlist
            </button>
          </li>
        ))}
      </ol>

      <br />
      <p>
        <strong>Total Items:</strong> {totalItems}
      </p>
      <p>
        <strong>Total Price:</strong> Rs. {totalCost}
      </p>
      <button>
        <Link to="/checkout">Checkout</Link>
      </button>
    </div>
  ) : (
    <div>
      <h2>Your Cart</h2>
      <p>Cart is empty.</p>
      <Link to="/shop">Shop now</Link>
    </div>
  );
}
