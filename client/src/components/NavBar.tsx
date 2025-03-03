import { useContext } from "react";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

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
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/products">Products</Nav.Link>
                <Nav.Link href="/reviews">Reviews</Nav.Link>
                <Nav.Link href="/account">Account</Nav.Link>
                <NavDropdown title="Register" id="navbarScrollingDropdown">
                  <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                  <NavDropdown.Item href="/signup">Sign up</NavDropdown.Item>
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
