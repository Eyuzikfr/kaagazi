export default function Checkout({ cart }) {
  const totalCost = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  async function createOrder() {
    const token = localStorage.getItem("token");

    const orderResponse = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error("Order creation failed:", orderData);
      return;
    }

    console.groupCollapsed("Order created:", orderData);

    // get eSewa payment data
    const paymentResponse = await fetch("http://localhost:5000/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: orderData.totalAmount,
        orderId: orderData.orderId,
      }),
    });

    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error("Payment setup failed:", paymentData);
      return;
    }

    console.log("Payment data:", paymentData);

    // submit payment to eSewa
    const form = document.createElement("form");

    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    for (const [key, value] of Object.entries(paymentData)) {
      const input = document.createElement("input");

      input.type = "hidden";
      input.name = key;
      input.value = value;

      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  }

  return (
    <div>
      <h2>Order Summary</h2>

      <ol className="cartList">
        {cart.map((item) => (
          <li key={item._id}>
            <p>
              {item.title} - {item.author}
            </p>
            <p>Rs. {item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Subtotal: Rs. {item.price * item.quantity}</p>
          </li>
        ))}
      </ol>

      <h3>Total: Rs. {totalCost}</h3>

      {totalCost !== 0 && (
        <button onClick={createOrder}>Place Order & Pay with eSewa</button>
      )}
    </div>
  );
}
