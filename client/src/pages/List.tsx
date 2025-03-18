import { useEffect, useState } from "react";
import useUserStatus from "../hooks/useUserStatus";
import { baseUrl } from "../utils/urls";
import { GetProductsListResponse, ProductsList } from "../types/customTypes";

import { Button, Row } from "react-bootstrap";

import { useNavigate } from "react-router";

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
      <h1>List</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : productsList ? (
        productsList!.map((product) => {
          return (
            <Row className="d-flex justify-content-center" key={product._id}>
              <ul>
                <li>{product.title}</li>
              </ul>

              {/* <ProductCard key={product._id} product={product} /> */}
            </Row>
          );
        })
      ) : (
        <>
          <h5 className="mb-4">Your list is empty</h5>
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
        </>
      )}
    </>
  );
}

export default List;
