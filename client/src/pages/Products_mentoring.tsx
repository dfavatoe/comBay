import { useEffect, useState } from "react";
import { fetchData } from "../hooks/useFetch_mentoring.tsx";
import { Col, Container, Row } from "react-bootstrap";
import ProductCard from "../components/ProductCard.tsx";
import { ProductT } from "../types/customTypes";

function Products() {
  const [products, setProducts] = useState<any>({});
  const [categories, setCategories] = useState({});

  // const productsRecords = products.records;
  // console.log("productsArrays :>> ", productsRecords);
  // console.log("type of productsArrays :>> ", typeof productsRecords);

  // productsRecords.map((item: {}) => {
  //   console.log(item);

  // const productsArray = productsArray.;
  // console.log("productsArrays :>> ", productsArray);
  // console.log("type of productsArrays :>> ", typeof productsArray);

  // const fetchAllProducts = async () => {
  //   fetch("http://localhost:5100/api/products/")
  //     .then((response) => response.text())
  //     .then((result) => console.log(result))
  //     .catch((error) => console.error(error));
  // };

  // const fetchCategoriesList = async () => {
  //   fetch("http://localhost:5100/api/products/categories-list")
  //     .then((response) => response.text())
  //     .then((result) => console.log(result))

  //     .catch((error) => console.error(error));
  // };

  // const productsResult = await fetchData<ProductT[]>;

  useEffect(() => {
    const productsResult = fetchData<ProductT[]>("products", setProducts);

    const categories = fetchData<any>(
      "products/categories-list",
      setCategories
    );

    // fetchAllProducts();
    // fetchCategoriesList();
  }, []);

  return (
    <>
      <div>Products</div>
      <Container className="justify-content-center">
        <Row className="g-1">
          {productsResult &&
            productsResult.map((product) => {
              return (
                <Col className="d-flex justify-content-center" key={product.id}>
                  <ProductCard key={product.id} product={product} />
                </Col>
              );
            })}
        </Row>
      </Container>
    </>
  );
}

export default Products;
