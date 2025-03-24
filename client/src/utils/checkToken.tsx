import { useEffect } from "react";
//REVIEW you are not using this anymore, do you? if so, just remove it.
useEffect(() => {
  //check in the local storage if there's a token.
  const token = localStorage.getItem("token");
  if (token) {
    console.log("%c User is logged in", "color: green");
  } else {
    console.log("%c User is logged out", "color: red");
  }
}, []);
