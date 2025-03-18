import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Stack,
} from "react-bootstrap";
import { ProductsList, ProductT } from "../types/customTypes";
import "../style/ProductCard.css";
import { Link } from "react-router";
import { MouseEvent } from "react";
import useUserStatus from "../hooks/useUserStatus";
import { baseUrl } from "../utils/urls";
import { addProductToList } from "../utils/addProductToList";

type ProductCardProps = {
  product: ProductsList;
};

function ProductCardList({ product }: ProductCardProps) {
  return (
    // <Card className="d-flex flex-inline zoom" style={{ width: "80vw" }}>
    //   <Col>
    //     <Card.Img
    //       className="image"
    //       variant="top"
    //       style={{ width: "100px" }}
    //       src={product.images[0]}
    //     />
    //   </Col>
    //   <Col className="d-inline">
    //     <Card.Body className="d-flex flex-column">
    //       <Card.Title>{product.title}</Card.Title>
    //       <Card.Subtitle className="mb-2 text-muted">
    //         {product.price} €
    //       </Card.Subtitle>
    //       <Stack gap={3}>
    //         <Link className="mb-2" to={`${product._id}`}>
    //           Learn more
    //         </Link>
    //       </Stack>
    //       <Button
    //         className="mt-auto mx-auto"
    //         style={{ maxWidth: "130px" }}
    //         variant="warning"
    //         // onClick={handleAddProductToList}
    //       >
    //         Reserve
    //       </Button>
    //     </Card.Body>
    //   </Col>
    // </Card>
    <Container className="mt-0">
      <Card className="p-0" style={{ height: "200px" }}>
        <Card.Body className="m-2">
          <Row>
            <Col md={2} className="border-end">
              <Card.Img
                className="image"
                // variant="top"
                style={{ maxWidth: "150px" }}
                src={product.images[0]}
              />
            </Col>
            <Col md={5} className="border-end">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {product.price} €
                </Card.Subtitle>
                <Stack gap={3}>
                  <Link className="mb-2" to={`/products/${product._id}`}>
                    See details
                  </Link>
                </Stack>
                <Button
                  className="mt-auto mx-auto"
                  style={{ maxWidth: "130px" }}
                  variant="warning"
                  // onClick={handleAddProductToList}
                >
                  Reserve
                </Button>
              </Card.Body>
            </Col>
            <Col md={4}>
              <Card.Title className="mt-3">Seller</Card.Title>
              <div>{product.seller.userName}</div>
              <Link
                className="mb-2"
                to={`https://maps.google.com/?q=${product.seller.address}`}
              >
                {product.seller.address}
              </Link>
              <div></div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductCardList;
