import "./css/Orders.css";

export default function Orders({ orders }) {
  return (
    <div>
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div key={order.id} className="orderCard">
          <p className="bbottom-1px-ccc">Order ID: {order.id}</p>
          <ol key={order.id} className="orderList">
            {order.items.map((item) => (
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
          <p>
            Total: Rs.
            {order.items.reduce((total, item) => {
              return total + item.price * item.quantity;
            }, 0)}
          </p>
        </div>
      ))}
    </div>
  );
}
