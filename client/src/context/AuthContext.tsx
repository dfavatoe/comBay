import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
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
  setEmailMessage: (value: SetStateAction<string | null>) => void;
  setPasswordMessage: (value: SetStateAction<string | null>) => void;
  setUserNameMessage: (value: SetStateAction<string | null>) => void;
  userNameMessage: string | null;
  emailMessage: string | null;
  passwordMessage: string | null;
  showAlert: boolean;
  setShowAlert: Dispatch<React.SetStateAction<boolean>>;
  alertText: string;
};

//6. Define initial value of contents shared by the Context
const contextInitialValue: AuthContextType = {
  user: null,
  loading: true,
  emailMessage: null,
  passwordMessage: null,
  userNameMessage: null,
  showAlert: false,
  alertText: "",
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
  setEmailMessage: () => {
    throw new Error("Context not initialized");
  },
  setPasswordMessage: () => {
    throw new Error("Context not initialized");
  },
  setUserNameMessage: () => {
    throw new Error("Context not initialized");
  },
  setShowAlert: () => false,
};

//1. Create Context
export const AuthContext = createContext<AuthContextType>(contextInitialValue);

//2. Create Provider
export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  //4. Move useStates and Functions to the Provider
  const { user, setUser } = useUserStatus();
  console.log("user authcontext :>> ", user);
  const [loading, setLoading] = useState(true); //? use this or bring loading from context?
  const [userNameMessage, setUserNameMessage] = useState<string | null>("");
  const [emailMessage, setEmailMessage] = useState<string | null>("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  // register ===================================================
  const register = async (credentials: RegisterCredentials | null) => {
    if (!credentials) {
      console.log("Complete the form.");
      setAlertText("Please complete the form.");
      setShowAlert(true);
      return;
    }

    const { userName, email, password, image, role } = credentials;
    let hasError = false;

    if (!userName) {
      console.log("Username is required.");
      setUserNameMessage("Please enter a username.");
      hasError = true;
    }

    if (!email) {
      console.log("Email is required.");
      setEmailMessage("Please enter an email address.");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("Invalid email format.");
      setEmailMessage("Please enter a valid email.");
      hasError = true;
    }

    if (!password) {
      console.log("Password is required.");
      setPasswordMessage("Please enter a password.");
      hasError = true;
    } else if (password.length < 6) {
      console.log("Password should be at least 6 characters.");
      setPasswordMessage("Password should be at least 6 characters.");
      hasError = true;
    }

    if (!role) {
      console.log("Role is required.");
      setAlertText("Please select a role.");
      setShowAlert(true);
      hasError = true;
    }

    // Stop execution if there are validation errors
    if (hasError) return;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("userName", userName);
    urlencoded.append("email", email);
    urlencoded.append("password", password);
    urlencoded.append("image", image);
    urlencoded.append("role", role);

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

      const result = (await response.json()) as RegisterOkResponse; // Parse JSON response

      if (response.status === 400) {
        setAlertText(result.message || "Email already exists in the database.");
        setShowAlert(true);
        return;
      }

      if (response.status === 500) {
        setAlertText(
          "An internal server error occurred. Please try again later."
        );
        setShowAlert(true);
        return;
      }

      console.log(result.message);
      if (!result.token) {
        throw new Error("Try to register again later");
      }
      if (result.token) {
        //store the token in the local storage
        localStorage.setItem("token", result.token);
        console.log("%c User is logged in", "color: green");
        setAlertText("You were successfully registered!");
        setShowAlert(true);
        setUser(result.user);
        setUserNameMessage(null);
        setEmailMessage(null);
        setPasswordMessage(null);
      }
    } catch (error) {
      console.log("error :>> ", error);
      setAlertText(`Something went wrong. ${error}.`);
      setShowAlert(true);
      setUser(null);
    }
  };

  // login ====================================================
  const login = async (credentials: LoginCredentials | null) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    if (!credentials) {
      console.log("No empty forms allowed.");
      setAlertText("Please complete all required fields.");
      setShowAlert(true);
      return;
    }

    const { email, password } = credentials;

    let hasError = false;

    if (!email) {
      console.log("Email is required.");
      setEmailMessage("Please enter an email address.");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("Invalid email format.");
      setEmailMessage("Please enter a valid email.");
      hasError = true;
    }

    if (!password) {
      console.log("Password is required.");
      setPasswordMessage("Please enter a password.");
      hasError = true;
    } else if (password.length < 6) {
      console.log("Password should be at least 6 characters.");
      setPasswordMessage("Password should be at least 6 characters.");
      hasError = true;
    }

    // Stop execution if there are validation errors
    if (hasError) return;

    // Proceed to append values
    urlencoded.append("email", email);
    urlencoded.append("password", password);

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
      setAlertText("Successful login!");
      setShowAlert(true);
      setEmailMessage(null);
      setPasswordMessage(null);
      console.log(result.message);

      if (!result.token) {
        setAlertText("Unable to retrieve authorization token.");
        setShowAlert(true);
        throw new Error("Unable to retrieve the token");
      }
      if (result.token) {
        //store the token in local storage
        localStorage.setItem("token", result.token);
        setUser(result.user);
        console.log("%c User is logged in", "color: green");
      }
    } catch (error) {
      setAlertText(`Something went wrong. ${error}.`);
      setShowAlert(true);
      console.log("error :>> ", error);
    }
  };

  // logout ====================================================
  const logout = () => {
    localStorage.removeItem("token");
    setAlertText("You were logged out");
    setShowAlert(true);
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
        emailMessage,
        passwordMessage,
        setEmailMessage,
        setPasswordMessage,
        setUserNameMessage,
        userNameMessage,
        showAlert,
        setShowAlert,
        alertText,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
