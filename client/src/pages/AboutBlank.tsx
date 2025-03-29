import { Button, Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router";

function AboutBlank() {
  const navigateTo = useNavigate();

  return (
    <>
      <h2>Got lost?</h2>
      <p>The requested page doesn't exist.</p>
      <Container className="w-75 d-flex justify-content-center">
        <Image
          src="https://res.cloudinary.com/dsf34lqnj/image/upload/v1740753749/comBay/cd4o6m2cyqomqgkhnrhe.jpg"
          fluid
        />
      </Container>
      <Button
        className="mt-4 mb-2"
        variant="warning"
        onClick={() => {
          navigateTo("/");
        }}
      >
        Return to Home
      </Button>
      <p className="mb-0">or</p>
      <Button onClick={() => navigateTo(-1)} variant="link">
        click here to go to the previous page.
      </Button>
    </>
  );
}

export default AboutBlank;
