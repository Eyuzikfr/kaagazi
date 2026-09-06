export default function Checkout({ cart, placeOrder }) {
  const totalCost = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <div>
      <h2>Order Summary</h2>

      <ol className="cartList">
        {cart.map((item) => (
          <li key={item.id}>
            <p>
              {item.name} - {item.author}
            </p>
            <p>Rs. {item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Subtotal: Rs. {item.price * item.quantity}</p>
          </li>
        ))}
      </ol>

      <h3>Total: Rs. {totalCost}</h3>

      {totalCost !== 0 && <button onClick={placeOrder}>Place Order</button>}
    </div>
  );
}
