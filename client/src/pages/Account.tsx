//to have an account page as a dashboard with icons, the page has to be refreshed each time the user click on a icon/ option. Ex.: UserProfile, list of Products, Contacts, etc.

import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import {
  GetProfileOfResponse,
  PutUpdateResponse,
  User,
} from "../types/customTypes";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
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
    myHeaders.append("Content-Type", "application/x-www-form-urlencode");

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
    console.log("Addresult :>> ", result);

    if (response.ok) {
      setUser(result.user);
      setMessageName("Name updated successfully!");
    } else {
      setMessageName(result.error || "Failed to update name.");
    }
    handleGetUserProfile();
  };

  //======================================================================

  return (
    <>
      <h1>Account</h1>

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
                <Button type="submit" className="d-block ml-2 mb-3">
                  Update
                </Button>
              </Form>
              {messageName && <p>{messageName}</p>}
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
                  className="mb-2 d-blockinline"
                  type="text"
                  placeholder="Enter new address"
                  value={newAddress}
                  onChange={handleAddressChange}
                  required
                />
                <Button type="submit" className="d-block ml-2 mb-3">
                  Update
                </Button>
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

          <Button active onClick={handleGetUserProfile}>
            User Profile
          </Button>
          {/* //!complete with other user's fields */}
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
