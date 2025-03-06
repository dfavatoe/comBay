//! Attention, bring what is necessary to the AuthContext
//to have an account page as a dashboard with icons, the page has to be refreshed each time the user click on a icon/ option. Ex.: UserProfile, list of Products, Contacts, etc.

import { useEffect, useState } from "react";
import { GetProfileOfResponse, User } from "../types/customTypes";
import { Image } from "react-bootstrap";

function Account() {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  const getUserProfile = async () => {
    const token = localStorage.getItem("token");

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
      //!We need a function/hook that sets the user as logged in everytime the page refreshes "useUserLoggedIn"
      setLoggedUser(result.user);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <>
      <h1>Account</h1>
      {loggedUser && (
        <div>
          {/* //!complete with other user's fields */}
          <h3>Hi {loggedUser.userName}</h3>
          <Image
            style={{ width: "200px" }}
            src={loggedUser.image}
            alt="user profile pic"
            rounded
          />
        </div>
      )}
    </>
  );
}

export default Account;
