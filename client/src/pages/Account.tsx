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
  const [messageName, setMessageName] = useState("");

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

  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setNewUserName(e.target.value);
    console.log("newUserName :>> ", newUserName);
  };

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
    setUser(result.user);
    if (response.ok) {
      setMessageName("Name updated successfully!");
    } else {
      setMessageName(result.error || "Failed to update name.");
    }
    handleGetUserProfile();
  };

  return (
    <>
      <h1>Account</h1>

      {user ? (
        <div>
          <Form onSubmit={submitNewName} className="mb-4">
            <Row>
              <Col>
                <h5>User Profile:</h5>
                <p></p>
                <h3></h3>
                <Form.Label>
                  <b>User name: </b> {user.userName}
                </Form.Label>
                <Form.Control
                  className="mb-3 d-inline"
                  type="username"
                  placeholder="Enter new name"
                  value={newUserName}
                  onChange={handleUserNameChange}
                  required
                />
                <Button type="submit" className="d-inline">
                  Submit
                </Button>
                {messageName && <p>{messageName}</p>}
              </Col>
              <Col>
                <Image
                  style={{ width: "200px" }}
                  src={user.image}
                  alt="user profile pic"
                  rounded
                />
              </Col>
            </Row>
          </Form>
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
