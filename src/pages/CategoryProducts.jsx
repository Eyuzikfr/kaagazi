import { useParams } from "react-router-dom";

export default function CategoryProducts({ categories }) {
  const { categoryId } = useParams();

  const category = categories.find(
    (category) => category.id === Number(categoryId),
  );

  return category ? (
    <div>
      <h2>{category.name}</h2>

      {category.products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Author: {product.author}</p>
          <p>Rs. {product.price}</p>
        </div>
      ))}
    </div>
  ) : (
    <p>Category not found</p>
  );
}
