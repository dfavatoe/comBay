import "../src/style/App.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Products from "./pages/Products";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AboutBlank from "./pages/AboutBlank";
import { AuthContext, AuthContextProvider } from "./context/AuthContext";
import SingleProductPage from "./pages/SingleProductPage";
import Account from "./pages/Account";
import { useContext } from "react";
import { Spinner } from "react-bootstrap";
import List from "./pages/List";
import Seller from "./pages/Seller";
import Footer from "./components/Footer";

const Root = () => {
  // const { loading, setLoading } = useContext(AuthContext);
  // setLoading(false);

  return (
    <>
      <div className="content-container">
        <NavBar />
        <Outlet />
      </div>
      <div className="footer-container">
        <Footer />
      </div>
    </>
  );
};

function App() {
  return (
    <>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" />
            <Route element={<Root />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route
                path="products/:productId"
                element={<SingleProductPage />}
              />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="account" element={<Account />} />
              <Route path="productsList" element={<List />} />
              <Route path="seller/:sellerId" element={<Seller />} />
              <Route path="*" element={<AboutBlank />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </>
  );
}

export default App;
