import { Button, Card, Col, Container, Row, Stack } from "react-bootstrap";
import { ProductT } from "../types/customTypes";
import "../style/ProductCard.css";
import { Link } from "react-router";
import { MouseEvent } from "react";
import { addProductToList } from "../utils/addProductToList";
import { baseUrl } from "../utils/urls";
import useUserStatus from "../hooks/useUserStatus";

type ProductCardProps = {
  product: ProductT;
};

function ProductCardStore({ product }: ProductCardProps) {
  const { token, setUser } = useUserStatus();

  const countStars = (productRating: number | null) => {
    if (productRating) {
      const fullStars = "★";
      const emptyStars = "☆";
      const starInt = Math.floor(productRating);
      const totalStars =
        fullStars.repeat(starInt) + emptyStars.repeat(5 - starInt);
      return totalStars;
    }
  };

  const handleAddProductToList = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await addProductToList({
      productId: product._id,
      token,
      baseUrl,
      setUser,
    });
  };

  return (
    <Container className="mt-0">
      <Card
        className="p-0"
        style={{ width: "auto", height: "auto", textAlign: "left" }}
      >
        <Card.Body className="m-2">
          <Row>
            <Col
              md={2}
              sm={6}
              className="d-flex justify-content-center border-end"
            >
              <Card.Img
                className="image"
                variant="top"
                style={{ objectFit: "cover" }}
                src={product.images[0]}
              />
            </Col>
            <Col md={5} sm={6} className="border-end">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.title}</Card.Title>
                <span className="paint-stars mb-2">
                  {countStars(product.rating)}
                </span>
                <Card.Subtitle className="mb-2">
                  {product.price} €
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  Discount: {product.discountPercentage} %
                </Card.Subtitle>
                <Link className="mb-2" to={`/products/${product._id}`}>
                  See details
                </Link>
              </Card.Body>
            </Col>
            <Col sm={6} className="d-flex-column justify-content-center" md={4}>
              <Card.Title className="mt-3">Description:</Card.Title>
              <div
                style={{
                  height: "100px",
                  overflowY: "scroll",
                  padding: "0.5em",
                  marginBottom: "1rem",
                }}
              >
                <Card.Subtitle
                  className="mb-2 text-muted"
                  style={{ textJustify: "auto" }}
                >
                  {product.description}
                </Card.Subtitle>
              </div>

              <Button
                className="mx-auto"
                onClick={handleAddProductToList}
                variant="warning"
              >
                Add to list
              </Button>
              <Container className="d-inline-flex justify-content-left"></Container>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductCardStore;
