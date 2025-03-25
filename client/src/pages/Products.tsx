import { useEffect, useState } from "react";
import { fetchData } from "../hooks/useFetch";
import { Container } from "react-bootstrap";
import { ProductsRoot, ProductT } from "../types/customTypes";
import Grid from "../components/Grid";

function Products() {
  const [products, setProducts] = useState<ProductsRoot | null>({
    message: "",
    amount: 0,
    records: [],
  });
  // const [categories, setCategories] = useState({});
  // const [loading, setLoading] = useState(true);
  console.log("products :>> ", products);
  const productsRecords = products!.records as ProductT[];
  console.log("productsArrays :>> ", productsRecords);
  console.log("type of productsArrays :>> ", typeof productsRecords);

  useEffect(() => {
    fetchData("products", setProducts);
    // fetchData("products/categories-list", setCategories);
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
      </Container>
    </Container>
  );
}

export default Products;
