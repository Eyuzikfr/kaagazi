export default function Checkout({ cart, placeOrder }) {
  const totalCost = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  async function handlePayment() {
    const response = await fetch("http://localhost:5000/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalCost,
      }),
    });

    const data = await response.json();

    const form = document.createElement("form");

    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    for (const [key, value] of Object.entries(data)) {
      const input = document.createElement("input");

      input.type = "hidden";
      input.name = key;
      input.value = value;

      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();

    console.log(data);
  }

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

      {totalCost !== 0 && (
        <button onClick={handlePayment}>Pay with eSewa</button>
      )}
    </div>
  );
}
