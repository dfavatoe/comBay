import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import { Button, Container, Form, Image, InputGroup } from "react-bootstrap";
import {
  ImageUploadOkResponse,
  User,
  UserRegisterForm,
  UserUploadOkResponse,
} from "../types/customTypes";

function SignUp() {
  const [newUser, setNewUser] = useState<UserRegisterForm | null>(null);
  const [user, setUser] = useState<User | null>(null); // bring this user to the userContext
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // const navigateTo = useNavigate();

  const handleAttachFile = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target :>> ", e);
    const file = e.target.files?.[0];
    if (file instanceof File) {
      console.log("selected File set");
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("selectedFile :>> ", selectedFile);
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

      const result = (await response.json()) as ImageUploadOkResponse;

      setNewUser({ ...newUser!, image: result.imageURL });

      console.log("result :>> ", result);
      console.log("newUser :>> ", newUser);
    } catch (error) {
      console.log("error :>> ", error);
    } finally {
      //delete the image preview
      if (typeof imagePreview === "string") {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    }
  };

  const handleRegisterInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.name :>> ", e.target.name);
    console.log("e.target.value :>> ", e.target.value);
    setNewUser({ ...newUser!, [e.target.name]: e.target.value });
  };

  const handleRoleButtonChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.name :>> ", e.target.id);
    setNewUser({ ...newUser!, role: e.target.id });
  };

  const handleSubmitRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("newUser :>> ", newUser);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    if (newUser) {
      urlencoded.append("userName", newUser.userName);
      urlencoded.append("email", newUser.email);
      if (newUser.password.length < 4) {
        alert("Password should be at least 4 characters.");
      } else {
        urlencoded.append("password", newUser.password);
      }
      urlencoded.append("image", newUser.image);
      urlencoded.append("role", newUser.role);
    } else {
      console.log("No empty forms allowed.");
      alert("Please, complete the form.");
    }

    const requestOptionsUser = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        "http://localhost:5100/api/users/register",
        requestOptionsUser
      );
      const result = (await response.json()) as UserUploadOkResponse;
      alert(result.message);
      setUser(result.user); //bring this user to the userContext
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <>
      <Container className="justify-content-center">
        <h1>Sign Up</h1>
        <br />
        {user ? (
          <div>
            <h2>Welcome {user.userName}!</h2>
            <h3>
              Congratulations, you have successfully created an account!!! 🙌
            </h3>
          </div>
        ) : (
          <p>
            Join us today for exclusive deals, fast checkout, and a seamless
            shopping experience!
          </p>
        )}

        <Form onSubmit={handleSubmitRegister}>
          <Image
            className="mb-4"
            width={200}
            src={newUser ? newUser.image : ""}
            rounded
          />
          <Form.Group className="mb-3 justify-content-center">
            <Form.Label>User name</Form.Label>
            <Form.Control
              type="text"
              name="userName"
              id="signup-user-name"
              // value={newUser}
              // onChange={handleUserNameChange}
              placeholder="Enter a user name"
              onChange={handleRegisterInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 justify-content-center">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="text"
              name="email"
              id="signup-email"
              // value={email}
              // onChange={handleEmailChange}
              placeholder="Enter your email"
              onChange={handleRegisterInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="text"
              name="password"
              id="signup-password"
              // value={password}
              // onChange={handlePasswordChange}
              placeholder="Choose a password"
              onChange={handleRegisterInputChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Upload your profile picture</Form.Label>
            <Form.Group controlId="formFile" className="mb-3">
              <InputGroup className="mb-4">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleAttachFile}
                />
                <Button
                  type="submit"
                  variant="outline-secondary"
                  id="button-addon2"
                  onClick={handleImageUpload}
                >
                  Upload
                </Button>
              </InputGroup>
              <div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="image preview"
                    style={{ width: "70px", height: "auto", border: "solid" }}
                  />
                )}
              </div>
            </Form.Group>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="d-block">Sign up as:</Form.Label>
            <Form.Check
              inline
              type="radio"
              label="Buyer"
              name="roleOption"
              id="buyer"
              onChange={handleRoleButtonChange}
            />
            <Form.Check
              inline
              type="radio"
              label="Seller"
              name="roleOption"
              id="seller"
              onChange={handleRoleButtonChange}
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
