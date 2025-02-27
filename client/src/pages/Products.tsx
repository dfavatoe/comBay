import { useEffect } from "react";

function Products() {
  // const fetchAllProducts = async () => {
  //   fetch("http://localhost:5100/api/products/")
  //     .then((response) => response.text())
  //     .then((result) => console.log(result))
  //     .catch((error) => console.error(error));
  // };

  const fetchCategoriesList = async () => {
    fetch("http://localhost:5100/api/products/categories-list")
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    // fetchAllProducts();
    fetchCategoriesList();
  }, []);

  return <div>Products</div>;
}

export default Products;
