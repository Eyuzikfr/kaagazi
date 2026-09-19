import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ProductDetails({ addToCart, addToWishlist }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);

        if (window.gtag) {
          window.gtag("event", "view_item", {
            currency: "NPR",
            value: data.price,
            items: [
              {
                item_id: data._id,
                item_name: data.title,
                price: data.price,
              },
            ],
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{product.title}</h2>
      <p>Author: {product.author}</p>
      <p>{product.description}</p>
      <p>Price: Rs. {product.price}</p>
      <p>Category: {product.category.name}</p>

      <button onClick={() => addToCart(product)}>Add to Cart</button>
      <button onClick={() => addToWishlist(product)}>Add to Wishlist</button>

      <Link to="/shop">Back to Shop</Link>
    </div>
  );
}
