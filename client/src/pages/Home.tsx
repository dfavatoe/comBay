import { useEffect, useState } from "react";
import useUserStatus from "../hooks/useUserStatus";
import { Button, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import video from "../assets/comBay_extra_small.mp4";
import "../style/Home.css";
import { ProductsRoot, ProductT } from "../types/customTypes";
import { fetchData } from "../hooks/useFetch";
import "../style/Products.css";
import ProductCarousel from "../components/ProductCarousel";

function Home() {
  const { token, user } = useUserStatus();

  function loader() {
    const [products, setProducts] = useState<ProductsRoot | null>({
      message: "",
      amount: 0,
      records: [],
    });

    const productsRecords = products!.records as ProductT[];

    const navigateTo = useNavigate();

    useEffect(() => {
      fetchData("products", setProducts);
    }, []);
    if (!productsRecords) {
      return (
        <div>
          <Spinner animation="border" variant="warning" />
          <p>Loading...</p>
        </div>
      );
    } else {
      return (
        <>
          <Container
            id="home-container"
            className="m-0 p-0"
            style={{ maxWidth: "100%" }}
          >
            <Container id="video-container" fluid>
              <video
                className="mb-2"
                id="video"
                width="100%"
                height="auto"
                autoPlay
                loop
                muted
              >
                <source src={video} type="video/mp4"></source>
              </video>
              <Container id="title-container" fluid>
                <h1 aria-label="allBuy has">comBay</h1>
                <p>
                  Find everything, everywhere, <br /> anytime.
                </p>
              </Container>

              {/* Text Overlay */}
              <div id="text-container">
                <div className="text-container">
                  <div>Books</div>
                  <div>Dresses</div>
                  <div>Groceries</div>
                  <div>Tablets</div>
                  <div>Smartphones</div>
                </div>
              </div>
            </Container>
          </Container>
          <Container className="d-block">
            <h2>Welcome to comBay</h2>
            {user ? (
              <>
                <h6>Hello {user.userName}!</h6>
              </>
            ) : (
              <>
                <h6>Sign in for the full experience.</h6>
                <Link to={"/login"}>Login</Link>
                <br />
              </>
            )}

            <Button
              className="mt-2 mb-2"
              variant="warning"
              onClick={() => {
                navigateTo("products");
              }}
            >
              Products
            </Button>
          </Container>
          <div className="second-header m-4" style={{ textAlign: "center" }}>
            Featured Products
          </div>
          {/* Products Carousel */}
          <ProductCarousel productsRecords={productsRecords} />
        </>
      );
    }
  }

  useEffect(() => {
    try {
      if (token) {
        console.log("%c user is logged in", "color:green");
      } else {
        console.log("%c user is logged out", "color:red");
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  }, [token]);

  return <>{loader()}</>;
}

export default Home;
