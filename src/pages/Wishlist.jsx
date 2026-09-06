export default function Wishlist({ wishlist, removeFromWishlist }) {
  return (
    <div>
      <h2>My Wishlist</h2>

      <ol className="cartList">
        {wishlist.map((item) => (
          <li key={item.id}>
            <p>
              {item.name} - {item.author}
            </p>
            <p>Rs. {item.price}</p>
            <button onClick={() => removeFromWishlist(item.id)}>Remove</button>
          </li>
        ))}
      </ol>
    </div>
  );
}
