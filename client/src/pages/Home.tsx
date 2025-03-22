import { useEffect } from "react";
import useUserStatus from "../hooks/useUserStatus";
import { Button, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import video from "../assets/comBay_hero.mp4";
import "../style/Home.css";

function Home() {
  const { token, user, loading, setLoading } = useUserStatus();

  const navigateTo = useNavigate();

  //!try to create this in a form of a component. We need to return something in the page to set the loader off. Like a response of a fetch.
  function loader() {
    if (!user) {
      return (
        <div>
          <Spinner animation="border" variant="warning" />
          <p>Loading...</p>
        </div>
      );
    } else {
      return (
        <>
          <Container className="m-0 p-0" style={{ maxWidth: "100%" }}>
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
                  Find everything, everywhere, <br /> every time.
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
                <p>{user._id}</p>
              </>
            ) : (
              <h6>Sign in for the full experience.</h6>
            )}
            <Link to={"/login"}>Login</Link>
            <br />
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
    } finally {
      setLoading(false);
    }
  }, [token]);

  return (
    <>
      {loader()}
      {/* <div>Home</div>
      {loading && (
        <div>
          <Spinner animation="border" variant="warning" />
          <p>Loading...</p>
        </div>
      )}
      {user ? (
        <h2>Hello {user.userName}</h2>
      ) : (
        <h2>Log in for the full experience</h2>
      )} */}
    </>
  );
}

export default Home;
