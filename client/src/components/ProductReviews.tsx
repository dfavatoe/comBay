import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import {
  Button,
  Card,
  Container,
  FloatingLabel,
  Form,
  Stack,
} from "react-bootstrap";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ModalLogin from "./ModalLogin";
import "../style/styles.css";
import ModalSignUp from "./ModalSignUp";

type ProductReviewsType = {
  author: string;
  text: string;
  date: Timestamp;
  rating: number | null;
  id: string; //doc id
  pid: number; //product's id
};

function ProductReviews({ pid }: ProductReviewsType) {
  const { user } = useContext(AuthContext);

  const [reviews, setReviews] = useState<ProductReviewsType[] | null>(null);

  const [reviewText, setReviewText] = useState<string>(" ");
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewStars, setReviewStars] = useState<string>("");

  //Modal Login Hooks and functions
  const [showLogin, setLoginShow] = useState(false);
  const handleLoginShow = () => setLoginShow(true);
  const handleLoginClose = () => setLoginShow(false);

  //Modal SignUp Hooks and functions
  const [showSignUp, setSignUpShow] = useState(false);
  const handleSignUpShow = () => setSignUpShow(true);
  const handleSignUpClose = () => setSignUpShow(false);

  const countStars = (productRating: number | null) => {
    if (productRating) {
      const fullStars = "★";
      const emptyStars = "☆";
      const starInt = Math.floor(productRating);
      const totalStars =
        fullStars.repeat(starInt) + emptyStars.repeat(5 - starInt);
      return totalStars;
    }
  };

  const formatDate = (seconds: number) => {
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    } as Intl.DateTimeFormatOptions;
    const formatDate = new Date(seconds * 1000).toLocaleString(
      "en-GB",
      options
    );
    return formatDate;
  };

  const haldleReviewTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    console.log("e.target.value :>> ", e.target.value);
    setReviewText(e.target.value);
  };

  const haldleReviewRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("Range ", parseInt(e.target.value));
    setReviewRating(parseInt(e.target.value));

    const ratingValue = parseInt(e.target.value);
    switch (ratingValue) {
      case 1:
        setReviewStars("★");
        break;
      case 2:
        setReviewStars("★★");
        break;
      case 3:
        setReviewStars("★★★");
        break;
      case 4:
        setReviewStars("★★★★");
        break;
      case 5:
        setReviewStars("★★★★★");
        break;
    }
  };

  const handleReviewSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //prevent refreshing page
    if (!user) {
      alert("Please login first.");
      return;
    }
    // define a new Review object
    const newReview = {
      text: reviewText,
      date: new Date(),
      author: user.email, // connect to the AuthContext to obtain the review's user.
      rating: reviewRating,
      pid: pid,
    };
    console.log("productIdNumb :>> ", pid);

    //add the new Review object to the collection
    const docRef = await addDoc(collection(db, "productsreview"), newReview);
    if (!docRef) {
      throw new Error("Something went wrong!");
    }
    if (docRef) {
      console.log("Message sent succesfully. Document ID:  ", docRef.id);
    }
  };

  // https://firebase.google.com/docs/firestore/query-data/listen#listen_to_multiple_documents_in_a_collection
  // this is not an async method. No need to declare as such
  const getReviewsServerLive = () => {
    console.log("pid :>> ", pid);
    const queryByDate = query(
      collection(db, "productsreview"),
      where("pid", "==", pid),
      orderBy("date", "desc"),
      limit(5)
    );

    onSnapshot(queryByDate, (querySnapshot) => {
      const reviewsArray: ProductReviewsType[] = [];

      querySnapshot.forEach((doc) => {
        const review: ProductReviewsType = {
          text: doc.data().text,
          date: doc.data().date,
          author: doc.data().author,
          rating: doc.data().rating,
          id: doc.id,
          pid: doc.data().pid,
        };
        reviewsArray.push(review);
        setReviews(reviewsArray);
      });
      console.log("reviewsArray :>> ", reviewsArray);
    });
  };

  useEffect(() => {
    getReviewsServerLive();
  }, []);

  return (
    <>
      <Container style={{ width: "auto", height: "auto", textAlign: "left" }}>
        <Stack>
          {reviews &&
            reviews.map((review) => {
              return (
                <Card
                  key={review.id}
                  style={{
                    width: "auto",
                    height: "auto",
                    textAlign: "left",
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  }}
                >
                  <Card.Body>
                    <Card.Title>{review.author}</Card.Title>
                    <Card.Subtitle className="paint-stars mb-2">
                      {countStars(review.rating)}
                    </Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">
                      {formatDate(review.date.seconds)}
                    </Card.Subtitle>
                    <hr></hr>
                    <Card.Text>{review.text}</Card.Text>
                  </Card.Body>
                </Card>
              );
            })}

          {user ? (
            <p>Please, write below your product's review.</p>
          ) : (
            <div>
              <p>
                Please, to write a review, click here first to{" "}
                <button
                  onClick={handleLoginShow}
                  style={{
                    background: "none",
                    color: "blue",
                    border: "none",
                    padding: 0,
                    outline: "none",
                    textDecorationLine: "underline",
                  }}
                >
                  log in
                </button>{" "}
                or{" "}
                <button
                  onClick={handleSignUpShow}
                  style={{
                    background: "none",
                    color: "blue",
                    border: "none",
                    padding: 0,
                    outline: "none",
                    textDecorationLine: "underline",
                  }}
                >
                  sign up.
                </button>
              </p>
            </div>
          )}

          <ModalLogin
            handleLoginClose={handleLoginClose}
            showLogin={showLogin}
          />

          <ModalSignUp
            handleSignUpClose={handleSignUpClose}
            showSignUp={showSignUp}
          />

          <Form onSubmit={handleReviewSubmit}>
            <FloatingLabel
              className="mb-3"
              controlId="floatingTextarea"
              label="Add your review..."
            >
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: "100px" }}
                onChange={haldleReviewTextChange}
              />
            </FloatingLabel>
            <Form.Label>
              Rating: <span className="paint-stars">{reviewStars}</span>{" "}
            </Form.Label>
            <Form.Range
              style={{ maxWidth: "250px" }}
              className="mb-4 d-block"
              min="1"
              max="5"
              onChange={haldleReviewRatingChange}
            ></Form.Range>
            <Button type="submit" className="mb-4" variant="warning">
              Submit
            </Button>
          </Form>
        </Stack>
      </Container>
    </>
  );
}

export default ProductReviews;
