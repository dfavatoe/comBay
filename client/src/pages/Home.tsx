import { useEffect } from "react";
import useUserStatus from "../hooks/useUserStatus";
import { Spinner } from "react-bootstrap";

function Home() {
  const { token, user, loading, setLoading } = useUserStatus();

  //!try to create this in a form of a component. We need to return something in the page to set the loader off. Like a response of a fetch.
  function loader() {
    if (!user && loading) {
      return (
        <div>
          <Spinner animation="border" variant="warning" />
          <p>Loading...</p>
        </div>
      );
    } else {
      return (
        <div>
          {user ? (
            <h2>Hello {user.userName}</h2>
          ) : (
            <h2>Log in for the full experience</h2>
          )}
        </div>
      );
    }
  }

  useEffect(() => {
    try {
      if (token) {
        console.log("%c user is logged in", "color:green");
      } else {
        console.log("%c user is logged out", "color:red");
      }
    } catch (error) {
      console.log("error :>> ", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  return (
    <>
      {loader()}
      {/* <div>Home</div>
      {loading && (
        <div>
          <Spinner animation="border" variant="warning" />
          <p>Loading...</p>
        </div>
      )}
      {user ? (
        <h2>Hello {user.userName}</h2>
      ) : (
        <h2>Log in for the full experience</h2>
      )} */}
    </>
  );
}

export default Home;
