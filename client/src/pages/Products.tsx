import { useEffect, useState } from "react";
import { fetchData } from "../hooks/useFetch";
import { Container, Row, Spinner } from "react-bootstrap";
import { ProductsRoot, ProductT } from "../types/customTypes";
import Grid from "../components/Grid";

function Products() {
  const [products, setProducts] = useState<ProductsRoot | null>({
    message: "",
    amount: 0,
    records: [],
  });
  const [categories, setCategories] = useState({});
  // const [loading, setLoading] = useState(true);
  console.log("products :>> ", products);
  const productsRecords = products!.records as ProductT[];
  console.log("productsArrays :>> ", productsRecords);
  console.log("type of productsArrays :>> ", typeof productsRecords);

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

  useEffect(() => {
    fetchData("products", setProducts);
    fetchData("products/categories-list", setCategories);
    // setLoading(false);
    // fetchAllProducts();
    // fetchCategoriesList();
  }, []);

  return (
    <Container>
      <h1 className="m-4" style={{ textAlign: "center" }}>
        comBay Products
      </h1>
      <Container className="justify-content-center">
        <>
          {productsRecords ? (
            <Grid products={productsRecords}></Grid>
          ) : (
            <h3>Sorry, no matches were found! 😕</h3>
          )}
        </>
        {/* <>
          {loading ? (
            <div>
              <Spinner animation="border" variant="warning" />
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {productsRecords ? (
                <Grid products={productsRecords}></Grid>
              ) : (
                <h3>Sorry, no matches were found! 😕</h3>
              )}
            </>
          )}
        </> */}
      </Container>
    </Container>
  );
}

export default Products;
