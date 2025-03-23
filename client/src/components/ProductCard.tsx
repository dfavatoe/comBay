import { Button, Card, Stack } from "react-bootstrap";
import { ProductsList, ProductT } from "../types/customTypes";
import "../style/ProductCard.css";
import { Link } from "react-router";
import { MouseEvent } from "react";
import useUserStatus from "../hooks/useUserStatus";
import { baseUrl } from "../utils/urls";
import { addProductToList } from "../utils/addProductToList";

type ProductCardProps = {
  product: ProductT;
};

function ProductCard({ product }: ProductCardProps) {
  const { token, setUser } = useUserStatus();

  // const [newProductinList, setNewProductInList] = useState("");

  const handleAddProductToList = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await addProductToList({ productId: product._id, token, baseUrl, setUser });
  };

  return (
    <Card
      className="zoom"
      style={{
        width: "18rem",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
      }}
    >
      <Card.Img className="image" variant="top" src={product.images[0]} />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {product.price} €
        </Card.Subtitle>
        <Stack gap={3}>
          <Link className="mb-2" to={`/products/${product._id}`}>
            Learn more
          </Link>
        </Stack>
        <Button
          className="mt-auto mx-auto"
          style={{ maxWidth: "130px" }}
          variant="warning"
          onClick={handleAddProductToList}
        >
          Add to list
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
