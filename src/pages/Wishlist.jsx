import { Link } from "react-router-dom";

export default function Wishlist({ wishlist, removeFromWishlist, addToCart }) {
  return (
    <div>
      <h2>My Wishlist</h2>

      {wishlist.length !== 0 ? (
        <ol className="cartList">
          {wishlist.map((item) => (
            <li key={item._id}>
              <p>
                {item.title} - {item.author}
              </p>
              <p>Rs. {item.price}</p>

              <button onClick={() => removeFromWishlist(item._id)}>
                Remove
              </button>
              <button onClick={() => addToCart(item)}>Add To Cart</button>
            </li>
          ))}
        </ol>
      ) : (
        <div>
          <p>Your wishlist is empty.</p>
          <Link to="/shop">Browse Products</Link>
        </div>
      )}
    </div>
  );
}
