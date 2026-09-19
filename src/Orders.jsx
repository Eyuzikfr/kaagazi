import { useEffect, useState } from "react";
import "./css/Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to load orders:", data);
        return;
      }

      setOrders(data);
    }

    loadOrders();
  }, []);

  return (
    <div>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="orderCard">
            <p className="bbottom-1px-ccc">Order ID: {order._id}</p>

            <ol className="orderList">
              {order.items.map((item) => (
                <li key={item.productId}>
                  <p>{item.title}</p>

                  <p>Rs. {item.price}</p>

                  <p>Quantity: {item.quantity}</p>

                  <p>Subtotal: Rs. {item.subtotal}</p>
                </li>
              ))}
            </ol>

            <p>
              <strong>Total: Rs. {order.totalAmount}</strong>
            </p>

            <p>Status: {order.status}</p>

            <p>Payment: {order.paymentStatus}</p>
          </div>
        ))
      )}
    </div>
  );
}
