import { useEffect } from "react";

function Products() {
  const fetchAllProducts = async () => {
    fetch("http://localhost:5100/api/products/all")
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    // fetchAllProducts();
  }, []);

  return <div>Products</div>;
}

export default Products;
