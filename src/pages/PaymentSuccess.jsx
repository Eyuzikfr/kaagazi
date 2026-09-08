export default function PaymentSuccess() {
  const params = new URLSearchParams(window.location.search);
  const encodedData = params.get("data");

  const decodedData = JSON.parse(atob(encodedData));

  console.log(decodedData);

  return (
    <div>
      <h2>Payment Successful</h2>
      <p>Your payment was received.</p>
    </div>
  );
}
