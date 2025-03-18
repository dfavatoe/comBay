import { SetStateAction, useContext, useEffect, useState } from "react";
import { GetProfileOfResponse, User } from "../types/customTypes";
import { AuthContext } from "../context/AuthContext";

//check if there is a token and set a user status message
function useUserStatus(): {
  token: String | null;
  userStatusMessage: string;
  user: User | null;
  loading: Boolean;
  setLoading: (value: SetStateAction<boolean>) => void;
  setUser: (value: SetStateAction<User | null>) => void;
} {
  const [token, setToken] = useState<String | null>(null);
  const [userStatusMessage, setUserStatusMessage] = useState("");
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      setUserStatusMessage("user is logged in");
      console.log("%c user is logged in", "color:green");
    } else {
      setToken(null);
      setUserStatusMessage("user is logged out");
      console.log("%c user is logged out", "color:red");
    }
  };

  const getUserProfile = async () => {
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

  useEffect(() => {
    getToken();
    getUserProfile();
  }, [token]);

  return { token, userStatusMessage, user, loading, setLoading, setUser };
}

export default useUserStatus;
