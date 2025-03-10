import { useContext, useEffect } from "react";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import useUserStatus from "../hooks/useUserStatus";
import { Link } from "react-router";

function NavBar() {
  const { user, logout } = useContext(AuthContext);

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
                <Nav.Link to="/reviews" as={Link}>
                  Reviews
                </Nav.Link>
                <Nav.Link to="/account" as={Link}>
                  Account
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
                {user ? (
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
