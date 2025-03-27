import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useContext,
  useState,
} from "react";
import { Button, Container, Form, Image, InputGroup } from "react-bootstrap";
import {
  ImageUploadOkResponse,
  RegisterCredentials,
} from "../types/customTypes";
import { AuthContext } from "../context/AuthContext";
import ModalAlert from "../components/ModalAlert";

function SignUp() {
  const {
    user,
    register,
    userNameMessage,
    passwordMessage,
    emailMessage,
    showAlert,
    setShowAlert,
    alertText,
  } = useContext(AuthContext);
  const [newUser, setNewUser] = useState<RegisterCredentials | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const submitRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("newUser :>> ", newUser);

    register(newUser);
  };

  return (
    <>
      <Container
        className="justify-content-center"
        style={{ maxWidth: "600px" }}
      >
        <h1 className="mb-4" style={{ textAlign: "center" }}>
          Sign Up
        </h1>
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

        <Form onSubmit={submitRegister}>
          <Image
            className="mb-4"
            width={200}
            src={newUser ? newUser.image : undefined}
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
            <p style={{ color: "red", marginTop: "2px" }}>{userNameMessage}</p>
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
            <p style={{ color: "red", marginTop: "2px" }}>{emailMessage}</p>
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
            <p style={{ color: "red", marginTop: "2px" }}>{passwordMessage}</p>
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

          <Form.Group className="mb-2">
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
          <Form.Text className="d-block mb-4" muted>
            Selecting 'Buyer' allows you to browse products and create a
            shopping list. <br /> As a 'Seller' you can register your physical
            store and list products on our online platform.
          </Form.Text>

          <Button type="submit" className="mb-4" variant="warning">
            Register
          </Button>
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

export default SignUp;
