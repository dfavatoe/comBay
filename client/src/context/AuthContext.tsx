import { createContext, ReactNode, SetStateAction, useState } from "react";
import {
  LoginCredentials,
  LoginOkResponse,
  RegisterCredentials,
  RegisterOkResponse,
  User,
} from "../types/customTypes";
import { baseUrl } from "../utils/urls";
import useUserStatus from "../hooks/useUserStatus";

//3. Define Provider's props types
type AuthContextProviderProps = {
  children: ReactNode;
};

//5. Define the Context's type
type AuthContextType = {
  user: User | null;
  loading: Boolean;
  register: (credentials: RegisterCredentials | null) => {};
  login: (credentials: LoginCredentials | null) => Promise<void>;
  logout: () => void;
  setUser: (value: SetStateAction<User | null>) => void;
  setLoading: (value: SetStateAction<boolean>) => void;
};

//6. Define initial value of contents shared by the Context
const contextInitialValue: AuthContextType = {
  user: null,
  loading: true,
  login: () => {
    throw new Error("Context not initialized");
  },
  logout: () => {
    throw new Error("Context not initialized");
  },
  register: () => {
    throw new Error("Context not initialized");
  },
  setUser: () => {
    throw new Error("Context not initialized");
  },

  setLoading: () => {
    throw new Error("Context not initialized");
  },
};

//1. Create Context
export const AuthContext = createContext<AuthContextType>(contextInitialValue);

//2. Create Provider
export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  //4. Move useStates and Functions to the Provider
  const { user, setUser } = useUserStatus();
  console.log("user authcontext :>> ", user);
  const [loading, setLoading] = useState(true); //? use this or bring loading from context?

  // register ===================================================
  const register = async (credentials: RegisterCredentials | null) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    if (credentials) {
      urlencoded.append("userName", credentials.userName);
      urlencoded.append("email", credentials.email);
      if (credentials.password.length < 6) {
        alert("Password should be at least 6 characters.");
      } else {
        urlencoded.append("password", credentials.password);
      }
      urlencoded.append("image", credentials.image);
      urlencoded.append("role", credentials.role);
    } else {
      console.log("No empty forms allowed.");
      alert("Please, complete the form.");
    }

    const requestOptionsUser = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        `${baseUrl}/api/users/register`,
        requestOptionsUser
      );
      const result = (await response.json()) as RegisterOkResponse;
      console.log(result.message);
      // alert successful registration
      if (!result.token) {
        throw new Error("Try to register again later");
      }
      if (result.token) {
        //store the token in the local storage
        localStorage.setItem("token", result.token);
        console.log("%c User is logged in", "color: green");
        setUser(result.user);
      }
    } catch (error) {
      console.log("error :>> ", error);
      setUser(null);
    }
  };

  // login ====================================================
  const login = async (credentials: LoginCredentials | null) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    if (credentials) {
      urlencoded.append("email", credentials.email);
      urlencoded.append("password", credentials.password);
    } else {
      console.log("No empty forms allowed.");
      alert("Please, complete the login form.");
    }

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        `${baseUrl}/api/users/login`,
        requestOptions
      );
      const result = (await response.json()) as LoginOkResponse;
      console.log("result :>> ", result);
      // alert successful login
      console.log(result.message);
      if (!result.token) {
        throw new Error("Unable to retrieve the token"); //! Try to be more specific, handling credentials,etc
      }
      if (result.token) {
        //store the token in local storage
        localStorage.setItem("token", result.token);
        setUser(result.user);
        console.log("%c User is logged in", "color: blue");
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  // logout ====================================================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    console.log("%c User is logged out", "color: red");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        register,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
