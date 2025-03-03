import { useEffect } from "react";

useEffect(() => {
  //check in the local storage if there's a token.
  const token = localStorage.getItem("token");
  if (token) {
    console.log("%c User is logged in", "color: green");
  } else {
    console.log("%c User is logged out", "color: red");
  }
}, []);
