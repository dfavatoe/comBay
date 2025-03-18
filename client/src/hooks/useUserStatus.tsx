import { SetStateAction, useContext, useEffect, useState } from "react";
import { GetProfileOfResponse, User } from "../types/customTypes";
import { AuthContext } from "../context/AuthContext";

function useUserStatus(): {
  token: string | null;
  userStatusMessage: string;
  user: User | null;
  loading: boolean;
  setLoading: (value: SetStateAction<boolean>) => void;
  setUser: (value: SetStateAction<User | null>) => void;
  error: string | null;
} {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  ); // Initialize from localStorage
  const [userStatusMessage, setUserStatusMessage] = useState("");
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update user status when token changes
  useEffect(() => {
    if (token) {
      setUserStatusMessage("User is logged in");
      console.log("%c User is logged in", "color:green");
    } else {
      setUserStatusMessage("User is logged out");
      console.log("%c User is logged out", "color:red");
    }
  }, [token]);

  const getUserProfile = async () => {
    if (!token) return; // Prevent API call if token is missing

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
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
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
