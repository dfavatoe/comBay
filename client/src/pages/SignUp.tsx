import { ChangeEvent, MouseEvent, useState } from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";

function SignUp() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | string>("");

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

  const handleAttachFile = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log("e.target :>> ", e);
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImageUpload = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault;
    // console.log('selectedFile :>> ', selectedFile);
    const formdata = new FormData();
    formdata.append("image", selectedFile);

    const requestOptions = {
      method: "POST",
      body: formdata,
    };

    try {
      const response = await fetch(
        "http://localhost:5100/api/users/uploadimage",
        requestOptions
      );

      const result = await response.json();
      console.log("result :>> ", result);
    } catch (error) {
      console.log("error :>> ", error);
    }
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

          <Form.Label>Upload your profile picture</Form.Label>
          <Form.Group controlId="formFile" className="mb-3">
            <InputGroup>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleAttachFile}
              />
              <Button
                onClick={handleImageUpload}
                variant="outline-secondary"
                id="button-addon2"
              >
                Upload
              </Button>
            </InputGroup>
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
