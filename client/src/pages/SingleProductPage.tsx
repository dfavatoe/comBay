import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ProductSpecs, ProductT } from "../types/customTypes";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import ProductReviews from "../components/ProductReviews";
import { baseUrl } from "../utils/urls";
import { fetchData } from "../hooks/useFetch";
// import { Timestamp } from "firebase/firestore";

function SingleProductPage() {
  //State Hooks
  const [productSpecs, setProductSpecs] = useState<ProductSpecs | null>(null);

  const navigateTo = useNavigate();

  // UseRef Hook used to scroll the Page to the Reviews
  const topReviewsRef = useRef<HTMLHeadingElement | null>(null);
  const scrollCallback = () => {
    if (topReviewsRef.current) {
      topReviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // useParams extracts the ID from the URL
  const { productId } = useParams();
  console.log("productId :>> ", productId);
  console.log("productSpecs :>> ", productSpecs);

  // const productIdNumb = parseInt(productId!); //"!" forces the variable to be string, like casting
  // console.log("productIdNumb :>> ", productIdNumb);

  //!stopped here
  // const url = `${baseUrl}/api/products/productId/${productId}`;

  // const getSingleProduct = async () => {
  //   const response = await fetch(url);
  //   console.log("response :>> ", response);
  //   if (!response.ok) {
  //     navigateTo("/aboutblank");
  //   } else {
  //     const result = (await response.json()) as ProductT;
  //     console.log("single Product :>> ", result);
  //     setProductSpecs(result);
  //   }
  // };

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

  const inStock = (productSpecs: ProductT | null) => {
    if (productSpecs) {
      return productSpecs.stock ? (
        <h4 style={{ color: "#138808" }}>In stock</h4>
      ) : (
        <h4 style={{ color: "#dc143c" }}>Not available</h4>
      );
    }
  };

  const discount = (productSpecs: ProductT | null) => {
    if (productSpecs) {
      return productSpecs.discountPercentage > 0
        ? `Discount: ${productSpecs.discountPercentage} %`
        : null;
    }
  };

  const reservationMark = (productReservation: ProductT | null) => {
    const checked = "✅ ";
    const unchecked = "❌";
    return productReservation?.reservation ? (
      <span>
        {checked}
        {productReservation.reservationTime} minutes
      </span>
    ) : (
      unchecked
    );
  };

  useEffect(() => {
    // getSingleProduct();
    fetchData(`products/productId/${productId}`, setProductSpecs);
  }, []);

  return (
    <div>
      <h1>comBay Products</h1>
      {/* <p>Product ID: {productId} </p> */}
      {/* {console.log("productSpecs", productSpecs)} */}
      <Container style={{ width: "auto", height: "auto", textAlign: "left" }}>
        <Row>
          {productSpecs && (
            <>
              <Col sm="6">
                <h3>{productSpecs.productById.title}</h3>
                <p>
                  {productSpecs.productById.rating}{" "}
                  <span className="paint-stars">
                    {countStars(productSpecs.productById.rating)}
                  </span>
                  <Button onClick={() => scrollCallback()} variant="link">
                    See the reviews
                  </Button>
                </p>

                <h4>{productSpecs.productById.price} €</h4>
                <h6>{discount(productSpecs.productById)} </h6>
                <Image src={productSpecs.productById.images[0]} rounded fluid />
              </Col>

              <Col className="mb-4" sm="6">
                {inStock(productSpecs.productById)}
                <h5>Description:</h5>
                <ul>
                  <li>
                    Seller:{" "}
                    <a href="#">{productSpecs.productById.seller.userName}</a>{" "}
                  </li>
                  <li>
                    See more from
                    <a href="#"> {productSpecs.productById.brand}</a>{" "}
                  </li>
                  <li>{productSpecs?.productById.description}</li>
                </ul>
                <hr />
                <h5>Product Details:</h5>
                <ul>
                  <li>
                    <b>Reservation:</b>{" "}
                    {reservationMark(productSpecs.productById)}
                  </li>
                  <li>
                    <b>Warranty:</b> {productSpecs.productById.warranty}
                  </li>
                  <li>
                    <b>Return policy:</b>{" "}
                    {productSpecs.productById.returnPolicy}
                  </li>
                  <li>
                    <b>Minimum Order: </b>
                    {productSpecs.productById.minReservationQty} items
                  </li>
                </ul>
                <hr />
                <h5>Dimensions:</h5>
                <ul>
                  <li>
                    <b>Width:</b> {productSpecs.productById.dimensions.width} mm
                  </li>
                  <li>
                    <b>Height:</b> {productSpecs.productById.dimensions.height}{" "}
                    mm
                  </li>
                  <li>
                    <b>Depth:</b> {productSpecs.productById.dimensions.depth} mm
                  </li>
                </ul>
                <Button variant="warning">Add to cart</Button>
              </Col>
            </>
          )}
          <hr />
        </Row>
        <h4 ref={topReviewsRef}>Top Reviews:</h4>
        {/* <ProductReviews
          pid={productIdNumb}
          author={""}
          text={""}
          rating={null}
          id={""}
          date={new Timestamp(0, 0)}
        /> */}
      </Container>
    </div>
  );
}

export default SingleProductPage;
