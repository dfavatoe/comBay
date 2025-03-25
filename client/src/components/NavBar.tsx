import { useContext } from "react";
import {
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Spinner,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router";
import useUserStatus from "../hooks/useUserStatus";

function NavBar() {
  const { logout, user } = useContext(AuthContext);
  const { loading } = useUserStatus();

  return (
    <>
      <nav>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="/">comBay</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: "200px" }}
                navbarScroll
              >
                {/* as={Link} is used so that the Bootstrap link behaves as a React Link. Like this it won't refresh the page as normal <a> html link.  */}
                <Nav.Link to="/" as={Link}>
                  Home
                </Nav.Link>
                <Nav.Link to="/products" as={Link}>
                  Products
                </Nav.Link>

                <Nav.Link to="/account" as={Link}>
                  Account
                </Nav.Link>
                <Nav.Link to="/productsList" as={Link}>
                  List
                </Nav.Link>
                <NavDropdown title="Register" id="navbarScrollingDropdown">
                  <NavDropdown.Item to="/login" as={Link}>
                    Login
                  </NavDropdown.Item>
                  <NavDropdown.Item to="/signup" as={Link}>
                    Sign up
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <div className="d-lg-flex justify-content-end align-items-center">
                {loading ? (
                  <>
                    <Spinner animation="border" variant="warning" />
                    <p>...LOADING...</p>
                  </>
                ) : user ? (
                  <>
                    <div className="d-lg-inline-block">
                      Hello {user.userName}!
                    </div>
                    <Button
                      style={{ color: "orange" }}
                      onClick={logout}
                      variant="none"
                    >
                      <b>Log Out</b>
                    </Button>
                  </>
                ) : (
                  <Nav.Link href="/login">
                    Hello!
                    <span style={{ color: "orange" }}>
                      {" "}
                      <b>Log in</b>{" "}
                    </span>{" "}
                  </Nav.Link>
                )}
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </nav>
    </>
  );
}

export default NavBar;
