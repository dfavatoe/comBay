import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { LoginCredentials } from "../types/customTypes";
import { AuthContext } from "../context/AuthContext";
import ModalAlert from "../components/ModalAlert";

function Login() {
  const {
    user,
    login,
    emailMessage,
    passwordMessage,
    showAlert,
    setShowAlert,
    alertText,
  } = useContext(AuthContext);

  const [loginCredentials, setLoginCredentials] =
    useState<LoginCredentials | null>(null);

  const navigateTo = useNavigate();

  const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.name :>> ", e.target.name);
    console.log("e.target.value :>> ", e.target.value);

    setLoginCredentials({
      ...loginCredentials!,
      [e.target.name]: e.target.value,
    });
  };

  const submitLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(loginCredentials);
  };

  return (
    <>
      <Container style={{ maxWidth: "600px" }}>
        <h1 className="m-4" style={{ textAlign: "center" }}>
          Login
        </h1>
        {user ? (
          <div>
            <h3>You are logged in. 🔌</h3>
            <p>Hi {user.userName}! Welcome!</p>
          </div>
        ) : (
          <p>Log in to access your account and continue shopping.</p>
        )}
        <Form onSubmit={submitLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="text"
              name="email"
              id="email"
              onChange={handleLoginInputChange}
              placeholder="Enter email"
              // required
            />
            <p style={{ color: "red", marginTop: "2px" }}>{emailMessage}</p>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="text"
              name="password"
              id="password"
              onChange={handleLoginInputChange}
              placeholder="Password"
              // required
            />
            <p style={{ color: "red", marginTop: "2px" }}>{passwordMessage}</p>
          </Form.Group>
          {user ? (
            <>
              <p>
                Click on the Products button to continue your shopping
                experience.
              </p>

              <Button
                onClick={() => {
                  navigateTo("/products");
                }}
                type="button"
                className="mb-2"
                variant="warning"
              >
                Products
              </Button>
              <p className="mb-0">or</p>
              <Button onClick={() => navigateTo(-1)} variant="link">
                or click here to go to the previous page.
              </Button>
            </>
          ) : (
            <>
              <Button className="mb-2" variant="warning" type="submit">
                Login
              </Button>
              <div>Still not registered?</div>
              <Link to={"/signup"}>Sign Up</Link>
            </>
          )}
        </Form>
        <ModalAlert
          showAlert={showAlert}
          alertText={alertText}
          setShowAlert={setShowAlert}
        />
      </Container>
    </>
  );
}

export default Login;
