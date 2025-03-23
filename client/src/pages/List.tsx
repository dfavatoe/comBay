import { useEffect, useState } from "react";
import useUserStatus from "../hooks/useUserStatus";
import { baseUrl } from "../utils/urls";
import { GetProductsListResponse, ProductsList } from "../types/customTypes";

import { Button, Container, Row } from "react-bootstrap";

import { Link, useNavigate } from "react-router";
import ProductCardList from "../components/ProductCardList";

function List() {
  const { token, error } = useUserStatus();
  const [productsList, setProductsList] = useState<ProductsList[] | null>(null);

  const navigateTo = useNavigate();

  const handleGetShoppingList = async () => {
    if (!token) {
      console.log("User has to log in first");
      return; // Prevents execution if token is missing
    }

    // console.log("Fetching list with token:", token);

    try {
      const response = await fetch(`${baseUrl}/api/users/productsList`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.log("Something went wrong while fetching the list");
        return;
      }

      const result = (await response.json()) as GetProductsListResponse;
      console.log("result :>> ", result);
      if (result.amount === 0) {
        console.log("The list is empty");
        alert("The list is empty");
      }
      setProductsList(result.records);
    } catch (error) {
      console.error("Error fetching the list:", error);
    }
  };

  useEffect(() => {
    if (token) {
      handleGetShoppingList(); //Only call when token exists
    }
  }, [token]); //Runs only when token changes

  return (
    <>
      <Container className="justify-content-center">
        <h1 className="mb-4" style={{ textAlign: "center" }}>
          Shopping List
        </h1>
        {productsList ? (
          productsList.map((item) => {
            return (
              <Row className="d-flex justify-content-center" key={item._id}>
                <ProductCardList key={item._id} product={item} />
              </Row>
            );
          })
        ) : (
          <>
            <Container className="d-block">
              <h5 className="mb-4">Your list is empty</h5>
              <div className="d-block mb-4">
                <Link className="d-inline" to={"/signup"}>
                  Sign up{" "}
                </Link>
                <span>or </span>
                <Link className="d-inline" to={"/login"}>
                  log in{" "}
                </Link>
                to
              </div>
              <Button
                onClick={() => {
                  navigateTo("/products");
                }}
                type="button"
                className="mb-4"
                variant="warning"
              >
                Continue shopping
              </Button>
            </Container>
          </>
        )}
      </Container>
    </>
  );
}

export default List;
