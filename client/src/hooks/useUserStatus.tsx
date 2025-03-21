import { SetStateAction, useEffect, useState } from "react";
import { GetProfileOfResponse, User } from "../types/customTypes";

function useUserStatus(): {
  token: string | null;
  userStatusMessage: string;
  user: User | null;
  loading: boolean;
  setLoading: (value: SetStateAction<boolean>) => void;
  setUser: (value: SetStateAction<User | null>) => void;
  error: string | null;
} {
  const [user, setUser] = useState<User | null>(null);
  const getToken = () => {
    // console.log(
    //   'localStorage.getItem("token") :>> ',
    //   localStorage.getItem("token")
    // );
    const myToken =
      localStorage.getItem("token") === undefined
        ? null
        : localStorage.getItem("token");
    // console.log("myToken :>> ", myToken);
    return myToken;
  };
  const storedToken = getToken();
  const [token, setToken] = useState<string | null>(storedToken); // Initialize from localStorage
  const [userStatusMessage, setUserStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:5100/api/users/profile/", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const result = (await response.json()) as GetProfileOfResponse;
      setUser(result.user);
      setUserStatusMessage("User is logged in");
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log("token useEffect :>> ", token);
    if (!token) {
      setLoading(false);
      setUser(null);
      setUserStatusMessage("User is logged out");
      console.log("%c User is logged out", "color:red");
    }
    if (token) {
      getUserProfile();
      // setUserStatusMessage("User is logged in");
      console.log("%c User is logged in", "color:green");
    }
  }, [token]); // Runs once when token changes

  return {
    token,
    userStatusMessage,
    user,
    loading,
    setLoading,
    setUser,
    error,
  };
}

export default useUserStatus;
