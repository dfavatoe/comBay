import {
  Button,
  Card,
  Container,
  FloatingLabel,
  Form,
  Stack,
} from "react-bootstrap";
import useUserStatus from "../hooks/useUserStatus";
import { useNavigate } from "react-router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  GetReviewsResponse,
  PostNewReviewResponse,
  ReviewT,
} from "../types/customTypes";
import { baseUrl } from "../utils/urls";

interface ReviewsProp {
  productId: string;
}

function Reviews({ productId }: ReviewsProp) {
  // console.log("productId :>> ", productId);

  const { token, user } = useUserStatus();

  const navigateTo = useNavigate();

  const [reviews, setReviews] = useState<ReviewT[] | null>(null);

  const [reviewText, setReviewText] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewStars, setReviewStars] = useState<string>("");

  const getReviews = async () => {
    if (productId) {
      try {
        const response = await fetch(
          `http://localhost:5100/api/products/review/${productId}`,
          { method: "GET" }
        );
        console.log("response reviews :>> ", response);
        if (!response.ok) {
          console.log("Something went wrong");
        }
        const result = (await response.json()) as GetReviewsResponse;
        console.log("result get reviews :>> ", result);
        setReviews(result.reviews);
      } catch (error) {
        console.log("error :>> ", error);
      }
    } else {
      console.log("No product id provided.");
    }
  };

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

  const formatDate = (date: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return new Date(date).toLocaleString("en-GB", options);
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

  const submitNewReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //prevent submit when refreshing page
    if (!user) {
      alert("Please login first.");
      return;
    }
    // define a new Review object
    if (!reviewText || !reviewRating) {
      console.log("Fill in the review and choose the rating.");
      alert(
        "Please, fill in a review and move the rating bar to choose the number of stars."
      );
      return;
    }

    const newReview = {
      author: user.userName,
      email: user.email,
      rating: reviewRating,
      comment: reviewText,
      date: new Date(),
    };

    //add the new Review object to the collection
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    };

    const response = await fetch(
      `${baseUrl}/api/products/review/${productId}`,
      requestOptions
    );

    const result = (await response.json()) as PostNewReviewResponse;
    console.log("result :>> ", result);

    if (response.ok) {
      console.log("New review successfully added.", response);
      alert("Your review was successfully added");
      getReviews();
    } else {
      console.log(result.error || "Failed to post review.");
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <>
      <Container style={{ width: "auto", height: "auto", textAlign: "left" }}>
        {user ? (
          <p>Please, write below your product's review.</p>
        ) : (
          <div>
            <p>
              Please, to write a review, click here first to{" "}
              <button
                onClick={() => {
                  navigateTo("/login");
                }}
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
                onClick={() => {
                  navigateTo("/signup");
                }}
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

        <Form onSubmit={submitNewReview}>
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

        <Stack>
          {reviews ? (
            reviews.map((review, index) => {
              return (
                <Card
                  key={index}
                  style={{
                    width: "auto",
                    height: "auto",
                    textAlign: "left",
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  }}
                >
                  <Card.Body>
                    <Card.Title>{review.email}</Card.Title>
                    <Card.Subtitle className="paint-stars mb-2">
                      {countStars(review.rating)}
                    </Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">
                      {formatDate(review.date)}
                    </Card.Subtitle>
                    <hr></hr>
                    <Card.Text>{review.comment}</Card.Text>
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <p>Be the first one to make a review.</p>
          )}
        </Stack>
      </Container>
    </>
  );
}
export default Reviews;
