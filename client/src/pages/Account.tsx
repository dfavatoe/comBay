import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import {
  addProductT,
  CompleteAddress,
  CompleteAddressOkResponse,
  GetProfileOfResponse,
  ImageUploadOkResponse,
  PutUpdateResponse,
} from "../types/customTypes";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Row,
} from "react-bootstrap";
import useUserStatus from "../hooks/useUserStatus";
import { Link } from "react-router";
import { baseUrl } from "../utils/urls";
import ModalAlert from "../components/ModalAlert";

function Account() {
  const { token, user, setLoading, setUser } = useUserStatus();

  const [newUserName, setNewUserName] = useState("");
  const [completeAddress, setCompleteAddress] =
    useState<CompleteAddress | null>(null);
  const [messageName, setMessageName] = useState("");
  const [messageCompleteAddress, setMessageCompleteAddress] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  //===========================================================

  const [newProduct, setNewProduct] = useState<addProductT | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | string>("");

  //?===========================================================
  //============================================================

  const handleGetUserProfile = async () => {
    // console.log("working");
    if (token) {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      try {
        const response = await fetch(
          `${baseUrl}/api/users/profile/`,
          requestOptions
        );
        console.log("response :>> ", response);
        if (!response.ok) {
          console.error("Something went wrong");
        }
        const result = (await response.json()) as GetProfileOfResponse;
        setUser(result.user);
      } catch (error) {
        console.log("error :>> ", error);
      } finally {
        setLoading(false);
      }
    } else {
      setUser(null);
      // setLoading(false);
    }
  };

  //======================================================================

  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setNewUserName(e.target.value);
    console.log("newUserName :>> ", newUserName);
  };

  //======================================================================

  const submitNewName = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      console.log("user has to log in first");
      setAlertText("You have to log in first.");
      setShowAlert(true);
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    // myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    if (newUserName !== "") {
      urlencoded.append("userName", newUserName);
    } else {
      console.log("No empty forms allowed.");
      setAlertText("Complete the field name.");
      setShowAlert(true);
    }

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      // body: JSON.stringify({ newUserName }),
      body: urlencoded,
    };

    const response = await fetch(
      `${baseUrl}/api/users/update-name`,
      requestOptions
    );

    const result = (await response.json()) as PutUpdateResponse;

    if (response.ok) {
      setUser(result.user);
      setMessageName("Name updated successfully!");
      setNewUserName("");
    } else {
      setMessageName(result.error || "Failed to update name.");
    }
    handleGetUserProfile();
  };

  //======================================================================

  const handleCompleteAddress = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.name :>> ", e.target.name);
    console.log("e.target.value :>> ", e.target.value);
    setCompleteAddress({
      ...completeAddress!,
      [e.target.name]: e.target.value,
    });
  };

  //======================================================================

  const submitCompleteAddress = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      console.log("user has to log in first");
      setAlertText("You have to log in first.");
      setShowAlert(true);
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();
    if (completeAddress) {
      urlencoded.append("streetName", completeAddress.streetName);
      urlencoded.append("streetNumber", completeAddress.streetNumber);
      urlencoded.append("city", completeAddress.city);
      urlencoded.append("country", completeAddress.country!);
      urlencoded.append("state", completeAddress.state!);
      urlencoded.append("postalcode", completeAddress.postalcode);
    } else {
      console.log("Complete all fields");
      setAlertText("Complete all fields");
      setShowAlert(true);
    }

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: urlencoded,
    };

    const response = await fetch(
      `${baseUrl}/api/users/update-address`,
      requestOptions
    );
    console.log("response comp address :>> ", response);

    const result = (await response.json()) as CompleteAddressOkResponse;
    console.log(result);

    if (response.ok) {
      setUser(result.user);
      setMessageCompleteAddress("Address updated successfully!");
      setCompleteAddress(null);
    } else {
      setMessageCompleteAddress(result.error || "Failed to update address.");
    }
    handleGetUserProfile();
  };

  //======================================================================

  const deleteUserAddress = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!token) {
      console.log("User has to log in first");
      setAlertText("You have to log in first.");
      setShowAlert(true);
    }

    const requestOptions = {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await fetch(
      `${baseUrl}/api/users/delete-address`,
      requestOptions
    );

    const result = (await response.json()) as PutUpdateResponse;

    if (response.ok) {
      console.log("delete address result :>> ", result);
      setUser(result.user);
      setMessageCompleteAddress("Address deleted successfully!");
      setCompleteAddress(null);
    } else {
      setMessageCompleteAddress(result.error || "Failed to delete address.");
    }
    handleGetUserProfile();
  };

  //?======================================================================
  //?======================================================================

  //add data to newProduct, converting the necessary values to number
  const handleNewProductInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setNewProduct((prev) => ({
      ...prev!,
      [name]: type === "number" ? Number(value) : value, // Convert price to number
      seller: user!._id, // Assign the entire user object instead of just user.id string
    }));
  };

  //?======================================================================

  const submitNewProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      console.log("user has to log in first");
      setAlertText("You have to log in first.");
      setShowAlert(true);
      return;
    }

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct), // Send as JSON
    };

    const response = await fetch(
      `${baseUrl}/api/products/add-product`,
      requestOptions
    );

    const result = (await response.json()) as PutUpdateResponse;
    console.log("add product result :>> ", result);

    if (response.ok) {
      console.log("Product added successfully!");
      setAlertText("Product successfully added!");
      setShowAlert(true);
      setNewProduct(null);
    } else {
      console.log(result.error || "Failed to add the product.");
    }
  };

  //?======================================================================

  const handleAttachFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("e.target :>> ", e);
    const file = e.target.files?.[0];
    if (file instanceof File) {
      console.log("selected file set");
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
        `${baseUrl}/api/users/uploadimage`,
        requestOptions
      );

      const result = (await response.json()) as ImageUploadOkResponse;

      setNewProduct({ ...newProduct!, images: Array(result.imageURL) });

      console.log("result :>> ", result);
      console.log("newProduct :>> ", newProduct);
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

  //?====================================================================

  const handleReserveButtonChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.checked :>> ", e.target.checked);
    setNewProduct({ ...newProduct!, reservation: e.target.checked }); //sets reservation to true or false
  };

  //?====================================================================

  return (
    <>
      {user ? (
        <Container>
          <h1 className="mb-4" style={{ textAlign: "center" }}>
            Account
          </h1>
          <hr />
          <Row>
            <Col sm={6} style={{ textAlign: "left" }}>
              <Image
                className="mb-4"
                style={{ width: "200px" }}
                src={user.image}
                alt="user profile pic"
                rounded
              />

              {/* NewName Form */}
              <Form onSubmit={submitNewName} className="mb-4">
                <h5>User Profile:</h5>
                <Form.Label>
                  <b>Name: </b> {user.userName}
                </Form.Label>
                <Form.Control
                  style={{ maxWidth: "300px" }}
                  className="mb-2 d-blockinline"
                  type="text"
                  placeholder="Enter new name"
                  value={newUserName}
                  onChange={handleUserNameChange}
                  required
                />
                {messageName && <p>{messageName}</p>}
                <Button type="submit" className="d-block ml-2 mb-3">
                  Update
                </Button>
              </Form>
              <div className="mb-4">
                <b>Email: </b> {user.email}
              </div>
              {user.role === "seller" && (
                <div className="mb-4">
                  <b>comBay Store: </b>
                  {user.address ? (
                    <Link className="mb-2" to={`/seller/${user._id}`}>
                      My Store
                    </Link>
                  ) : (
                    <p>
                      Complete the address and add products to build your store.
                    </p>
                  )}
                </div>
              )}
            </Col>
            <Col
              sm={6}
              className="d-block"
              style={{
                textAlign: "left",
              }}
            >
              {/* NewAddress Form */}
              <Form onSubmit={submitCompleteAddress} className="mb-4">
                <h5 className="mb-4">User Contacts:</h5>
                <Form.Label className="d-block">
                  <b>Address: </b>{" "}
                  {user.address && (
                    <>
                      {user.address.streetName} {user.address.streetNumber}
                      {", "}
                      {user.address.postalcode} {user.address.city}
                    </>
                  )}
                </Form.Label>
                <Form.Label className="d-inline">Street Name:</Form.Label>{" "}
                <Form.Control
                  style={{ maxWidth: "300px" }}
                  className="mb-2 d-inline"
                  type="text"
                  name="streetName"
                  placeholder="Enter street name"
                  onChange={handleCompleteAddress}
                  required
                />{" "}
                <Form.Label className="d-inline">Number:</Form.Label>{" "}
                <Form.Control
                  style={{ maxWidth: "50px" }}
                  className="mb-2 d-inline"
                  type="text"
                  name="streetNumber"
                  onChange={handleCompleteAddress}
                  required
                />
                <div>
                  <Form.Label className="d-inline">City:</Form.Label>{" "}
                  <Form.Control
                    style={{ maxWidth: "300px" }}
                    className="mb-2 d-inline"
                    type="text"
                    name="city"
                    placeholder="Enter city name"
                    onChange={handleCompleteAddress}
                    required
                  />{" "}
                  <Form.Label className="d-inline">State:</Form.Label>{" "}
                  <Form.Control
                    style={{ maxWidth: "100px" }}
                    className="mb-2 d-inline"
                    type="text"
                    name="state"
                    onChange={handleCompleteAddress}
                  />{" "}
                </div>
                <div>
                  <Form.Label className="d-inline">Country:</Form.Label>{" "}
                  <Form.Control
                    style={{ maxWidth: "300px" }}
                    className="mb-2 d-inline"
                    type="text"
                    name="country"
                    placeholder="Enter country name"
                    onChange={handleCompleteAddress}
                  />{" "}
                  <Form.Label className="d-inline">Zipcode:</Form.Label>{" "}
                  <Form.Control
                    style={{ maxWidth: "100px" }}
                    className="mb-2 d-inline"
                    type="text"
                    name="postalcode"
                    onChange={handleCompleteAddress}
                    required
                  />{" "}
                  {messageCompleteAddress && <p>{messageCompleteAddress}</p>}
                </div>
                <Button type="submit" className="d-inline mb-3">
                  Update
                </Button>
                <Button
                  onClick={deleteUserAddress}
                  className="d-inline mx-2 mb-3"
                >
                  Delete
                </Button>
              </Form>
            </Col>
          </Row>
          <hr />

          {/* Seller - Products */}
          {user.role === "seller" && (
            <Container>
              <div
                className="second-header mb-4"
                style={{ textAlign: "center" }}
              >
                Add Products
              </div>
              <Row>
                <Col
                  sm={6}
                  className="mx-0 px-0 g-0"
                  style={{ textAlign: "left" }}
                >
                  <h5>Specifications:</h5>
                  <Form onSubmit={submitNewProduct}>
                    <Row>
                      <Col>
                        <Form.Group className="mb-3 justify-content-center">
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            id="product-title"
                            placeholder="Enter the product's title"
                            onChange={handleNewProductInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3 justify-content-center">
                          <Form.Label>Brand</Form.Label>
                          <Form.Control
                            type="text"
                            name="brand"
                            id="product-brand"
                            placeholder="Enter the product's brand"
                            onChange={handleNewProductInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3 justify-content-center">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        id="product-description"
                        // value={email}
                        // onChange={handleEmailChange}
                        placeholder="Describe the product"
                        onChange={handleNewProductInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        type="text"
                        name="category"
                        id="product-category"
                        // value={password}
                        // onChange={handlePasswordChange}
                        placeholder="Set the product's category"
                        onChange={handleNewProductInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="text"
                        name="price"
                        id="product-price"
                        // value={password}
                        // onChange={handlePasswordChange}
                        placeholder="Set a price"
                        onChange={handleNewProductInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        type="number"
                        name="stock"
                        id="product-stock"
                        // value={password}
                        // onChange={handlePasswordChange}
                        placeholder="Number of product's in stock"
                        onChange={handleNewProductInputChange}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Image</Form.Label>
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
                              style={{
                                width: "70px",
                                height: "auto",
                                border: "solid",
                              }}
                            />
                          )}
                        </div>
                      </Form.Group>
                    </Form.Group>
                    <Button
                      type="submit"
                      className="d-flex ml-2 mb-3 justify-content-end"
                    >
                      Add Product
                    </Button>
                  </Form>
                </Col>
                <Col sm={6} style={{ textAlign: "left" }}>
                  <h5>Product Details:</h5>
                  <Form.Group
                    className="mx-0 mb-3 px-0 g-0"
                    style={{ textAlign: "left" }}
                  >
                    <Form.Label>Warranty</Form.Label>
                    <Form.Control
                      type="text"
                      name="warranty"
                      id="product-warranty"
                      // value={password}
                      // onChange={handlePasswordChange}
                      placeholder="Warranty conditions"
                      onChange={handleNewProductInputChange}
                    />
                  </Form.Group>

                  <Form.Group
                    className="mx-0 mb-3 px-0 g-0"
                    style={{ textAlign: "left" }}
                  >
                    <Form.Label>Return policy</Form.Label>
                    <Form.Control
                      type="text"
                      name="returnPolicy"
                      id="product-return"
                      placeholder="Return conditions"
                      onChange={handleNewProductInputChange}
                    />
                  </Form.Group>

                  <Form.Group
                    className="mx-0 mb-3 px-0 g-0"
                    style={{ textAlign: "left" }}
                  >
                    <Form.Label>Minimum Reservation Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="minReservationQty"
                      id="product-minorder"
                      // value={password}
                      // onChange={handlePasswordChange}
                      placeholder="Minimum ammount of items for reservation"
                      onChange={handleNewProductInputChange}
                    />
                  </Form.Group>

                  <Form.Group
                    className="mx-0 mb-3 px-0 g-0"
                    style={{ textAlign: "left" }}
                  >
                    <Form.Label className="d-block">Dimensions (mm)</Form.Label>
                    <Form.Control
                      className="d-inline mx-2"
                      style={{ maxWidth: "30%" }}
                      type="text"
                      name="width"
                      id="product-width"
                      placeholder="Width"
                      onChange={handleNewProductInputChange}
                    />
                    <Form.Control
                      className="d-inline"
                      style={{ maxWidth: "30%" }}
                      type="text"
                      name="height"
                      id="product-height"
                      placeholder="Height"
                      onChange={handleNewProductInputChange}
                    />
                    <Form.Control
                      className="d-inline mx-2"
                      style={{ maxWidth: "30%" }}
                      type="text"
                      name="depth"
                      id="product-depth"
                      placeholder="Depth"
                      onChange={handleNewProductInputChange}
                    />
                  </Form.Group>
                  <Row className="mb-3" style={{ textAlign: "left" }}>
                    <Col style={{ maxWidth: "50%" }}>
                      <Form.Label>Discount</Form.Label>
                      <Form.Control
                        type="text"
                        name="discountPercentage"
                        id="product-discount"
                        placeholder="Discount percentage"
                        onChange={handleNewProductInputChange}
                      />
                    </Col>
                    <Col style={{ maxWidth: "50%" }}>
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        type="number"
                        name="rating"
                        id="product-rating"
                        placeholder="Self-Rating"
                        max={5}
                        onChange={handleNewProductInputChange}
                      />
                    </Col>
                  </Row>

                  <Form.Group className="mb-4" style={{ textAlign: "left" }}>
                    <Row className="mb-3" style={{ textAlign: "left" }}>
                      <Form.Label className="d-block">
                        Reservation (in minutes)
                      </Form.Label>
                      <Col style={{ maxWidth: "150px" }}>
                        <Form.Check
                          style={{ width: "50px" }}
                          // prettier-ignore
                          type="switch"
                          id="custom-switch"
                          label="Enable"
                          onChange={handleReserveButtonChange}
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          className="mx-2"
                          type="number"
                          name="reservationTime"
                          id="product-rating"
                          placeholder="Reservation time"
                          onChange={handleNewProductInputChange}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          )}
        </Container>
      ) : (
        <>
          <div>
            <h2>Please log in to check your account</h2>
            <div>Do you already have an account? Click here to login.</div>
            <Link to={"/login"}>Login</Link>
          </div>
          <div>Still not registered?</div>
          <Link to={"/signup"}>Sign Up</Link>
        </>
      )}
      <ModalAlert
        showAlert={showAlert}
        alertText={alertText}
        setShowAlert={setShowAlert}
      />
    </>
  );
}

export default Account;
