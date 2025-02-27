import { Button, Card, Stack } from "react-bootstrap";
import { ProductT } from "../types/customTypes";
import "../style/ProductCard.css";
import { Link } from "react-router";

type ProductCardProps = {
  product: ProductT;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="zoom" style={{ width: "18rem" }}>
      <Card.Img className="image" variant="top" src={product.images[0]} />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {product.price} €
        </Card.Subtitle>
        <Stack gap={3}>
          <Link className="mb-2" to={`${product._id}`}>
            Learn more
          </Link>
        </Stack>
        <Button
          className="mt-auto mx-auto"
          style={{ maxWidth: "130px" }}
          variant="warning"
        >
          Add to cart
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
