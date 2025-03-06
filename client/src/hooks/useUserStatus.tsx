import { useEffect, useState } from "react";

//check if there is a token and set a user status message
function useUserStatus() {
  const [token, setToken] = useState<String | null>("");

  const [userStatusMessage, setUserStatusMessage] = useState("");

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      setUserStatusMessage("user is logged in");
    } else {
      setToken(null);
      setUserStatusMessage("user is logged out");
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return { token, userStatusMessage };
}

export default useUserStatus;
