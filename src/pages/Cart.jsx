export default function Cart({ cart }) {
  return (
    <ol>
      {cart.map((product) => (
        <li key={product.id}>
          <p>
            {product.name} - {product.author}
          </p>
          <p>Rs. {product.price}</p>
        </li>
      ))}
    </ol>
  );
}
