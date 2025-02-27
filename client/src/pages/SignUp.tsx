import { ChangeEvent, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

function SignUp() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const navigateTo = useNavigate();

  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("object :>> ", e.target.value);
    setUserName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // const handleSubmitRegister = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // console.log("email, password :>> ", email, password)
  //   register(email, password);
  // };

  return (
    <>
      <Container className="justify-content-center">
        <h1>Sign Up</h1>
        {/* {user ? (
          <div>
            <h3>
              Congratulations, you have successfully created an account!!! 🙌
            </h3>
          </div>
        ) : (
          <p>
            Join us today for exclusive deals, fast checkout, and a seamless
            shopping experience!
          </p>
        )} */}
        {/* <Form onSubmit={handleSubmitRegister}> */}
        <Form>
          <Form.Group className="mb-3 justify-content-center">
            <Form.Label>User name</Form.Label>
            <Form.Control
              type="user-name"
              name="user-name"
              id="signup-user-name"
              value={userName}
              onChange={handleUserNameChange}
              placeholder="Enter a user name"
            />
          </Form.Group>

          <Form.Group className="mb-3 justify-content-center">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              id="signup-email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              id="signup-password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Chose a password"
            />
          </Form.Group>
          {/* {user ? (
            <>
              <p>
                Click on the Products button to start your shopping experience.
              </p>
              <Button
                onClick={() => {
                  navigateTo("/products");
                }}
                type="button"
                className="mb-4"
                variant="warning"
              >
                Products
              </Button>
            </>
          ) : (
            <>
              <Button type="submit" className="mb-4" variant="warning">
                Register
              </Button>
              <div>Do you already have an account? Click here to login.</div>
              <Link to={"/login"}>Login</Link>
            </>
          )} */}
          <Button type="submit" className="mb-4" variant="warning">
            Register
          </Button>
        </Form>
        {/* <ModalAlert
          showAlert={showAlert}
          alertText={alertText}
          setShowAlert={setShowAlert}
        /> */}
      </Container>
    </>
  );
}

export default SignUp;
