import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [message, setMessage] = useState("Updating payment...");

  useEffect(() => {
    async function updatePayment() {
      try {
        const params = new URLSearchParams(window.location.search);
        const encodedData = params.get("data");

        const decodedData = JSON.parse(atob(encodedData));

        console.log("eSewa response:", decodedData);

        const response = await fetch(
          "http://localhost:5000/api/payment/success",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              transaction_uuid: decodedData.transaction_uuid,
              status: decodedData.status,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Payment update failed:", data);
          setMessage("Payment received, but order update failed");
          return;
        }

        setMessage("Payment successful!");
      } catch (error) {
        console.error("PAYMENT SUCCESS ERROR:", error);
        setMessage("Something went wrong.");
      }
    }

    updatePayment();
  }, []);

  return (
    <div>
      <h2>{message}</h2>
      <p>Your payment was received.</p>
    </div>
  );
}
