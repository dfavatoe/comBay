//to have an account page as a dashboard with icons, the page has to be refreshed each time the user click on a icon/ option. Ex.: UserProfile, list of Products, Contacts, etc.

import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import {
  addProductT,
  GetProfileOfResponse,
  ImageUploadOkResponse,
  PutUpdateResponse,
  User,
} from "../types/customTypes";
import { Button, Col, Form, Image, InputGroup, Row } from "react-bootstrap";
import useUserStatus from "../hooks/useUserStatus";
import { Link } from "react-router";
import { baseUrl } from "../utils/urls";

function Account() {
  const { token, userStatusMessage, user, loading, setLoading, setUser } =
    useUserStatus();
  const [newUserName, setNewUserName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [messageName, setMessageName] = useState("");
  const [messageAddress, setMessageAddress] = useState("");

  //?===========================================================

  const [newProduct, setNewProduct] = useState<addProductT | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | string>("");

  //?===========================================================

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
          "http://localhost:5100/api/users/profile/",
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

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setNewAddress(e.target.value);
    console.log("newAddress :>> ", newAddress);
  };

  //======================================================================

  const submitNewName = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      console.log("user has to log in first");
      alert("You have to log in first");
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
      alert("Complete the field name.");
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

  const submitNewAddress = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      console.log("user has to log in first");
      alert("You have to log in first");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencode = new URLSearchParams();
    if (newAddress !== "") {
      urlencode.append("address", newAddress);
    } else {
      console.log("No empty forms allowed");
      alert("Complete the address field");
    }

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: urlencode,
    };

    const response = await fetch(
      `${baseUrl}/api/users/update-address`,
      requestOptions
    );

    const result = (await response.json()) as PutUpdateResponse;
    console.log("update address result :>> ", result);

    if (response.ok) {
      setUser(result.user);
      setMessageAddress("Address updated successfully!");
      setNewAddress("");
    } else {
      setMessageAddress(result.error || "Failed to update address.");
    }
    handleGetUserProfile();
  };

  //======================================================================

  const deleteUserAddress = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!token) {
      console.log("User has to log in first");
      alert("You have to log in first");
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
      setMessageAddress("Address deleted successfully!");
    } else {
      setMessageAddress(result.error || "Failed to delete address.");
    }
    handleGetUserProfile();
  };

  //?======================================================================
  //?======================================================================

  const handleNewProductInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.name :>> ", e.target.name);
    console.log("e.target.value :>> ", e.target.value);
    const { name, value, type } = e.target;

    setNewProduct((prev) => ({
      ...prev!,
      [name]: type === "number" ? Number(value) : value, // Convert price to number
    }));
    // setNewProduct({ ...newProduct!, [e.target.name]: e.target.value });
  };

  const submitNewProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      console.log("user has to log in first");
      alert("You have to log in first");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    //! Probably Json Stringify would be better
    const urlencode = new URLSearchParams();
    if (newProduct) {
      urlencode.append("title", newProduct.title);
      urlencode.append("description", newProduct.description);
      urlencode.append("category", newProduct.category);
      urlencode.append("price", String(newProduct.price));
      urlencode.append("stock", String(newProduct.stock));
      urlencode.append("seller", String(user!.id));
      urlencode.append("images", String(newProduct.images));
    } else {
      console.log("No empty forms allowed");
      alert("Complete the address field");
    }

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: urlencode,
    };

    const response = await fetch(
      `${baseUrl}/api/products/add-product`,
      requestOptions
    );

    const result = (await response.json()) as PutUpdateResponse;
    console.log("add product result :>> ", result);

    if (response.ok) {
      // setUser(result.user);
      console.log("Product added successfully!");
      setNewProduct(null);
    } else {
      // setMessageProduct(result.error || "Failed to update address.");
      console.log(result.error || "Failed to update address.");
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
        "http://localhost:5100/api/users/uploadimage",
        requestOptions
      );

      const result = (await response.json()) as ImageUploadOkResponse;

      setNewProduct({ ...newProduct!, images: Array(result.imageURL) }); //!check if this works

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

  return (
    <>
      <h1 className="mb-4">Account</h1>
      {user ? (
        <div>
          <Row>
            <Col
              className="d-block"
              style={{
                textAlign: "left",
              }}
            >
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

              <hr />
              {/* NewAddress Form */}
              <Form onSubmit={submitNewAddress} className="mb-4">
                <h5>User Contacts:</h5>
                <Form.Label>
                  <b>Address: </b> {user.address}
                </Form.Label>
                <Form.Control
                  style={{ maxWidth: "300px" }}
                  className="mb-2 d-block"
                  type="text"
                  placeholder="Enter new address"
                  value={newAddress}
                  onChange={handleAddressChange}
                  required
                />
                {messageAddress && <p>{messageAddress}</p>}

                <Button type="submit" className="d-inline mb-3">
                  Update
                </Button>
                <Button
                  onClick={deleteUserAddress}
                  className="d-inline mx-2 mb-3"
                >
                  Delete
                </Button>
                <div></div>
              </Form>
            </Col>
            <Col>
              <Image
                style={{ width: "200px" }}
                src={user.image}
                alt="user profile pic"
                rounded
              />
              <div className="mt-2">
                <b>ID: </b> {user.id}
              </div>
            </Col>
          </Row>
          <hr />

          {/* Seller - Products */}
          {user.role === "seller" && (
            <>
              <h1>Your Products</h1>
              <Row>
                <Col className="mx-0 px-0 g-0" style={{ textAlign: "left" }}>
                  <h5>Add Product:</h5>
                  <Form onSubmit={submitNewProduct}>
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

                    {/* <Form.Group className="mb-3">
                      <Form.Label>Image</Form.Label>
                      <Form.Control
                        type="text"
                        name="images"
                        id="product-image"
                        // value={password}
                        // onChange={handlePasswordChange}
                        placeholder="Place image's URL"
                        onChange={handleNewProductInputChange}
                      />
                    </Form.Group> */}

                    <Button type="submit" className="d-block ml-2 mb-3">
                      Add
                    </Button>
                  </Form>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Upload the product's picture</Form.Label>
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
                </Col>
              </Row>
            </>
          )}
        </div>
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
    </>
  );
}

export default Account;
