import "./App.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Products from "./pages/Products";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AboutBlank from "./pages/AboutBlank";

const Root = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" />
          <Route element={<Root />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="*" element={<AboutBlank />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
