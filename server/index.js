import express from "express";
import colors from "colors";
import cors from "cors";

const app = express();

const port = process.env.PORT || 5100; //we use the PORT variable to let our project ready for deployment, because we don't know which PORT will be used in the server. 5000 is our port while developing the project.

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

//listen to requests from the client through port 5100
app.listen(port, () => {
  console.log(`Server is running on port ${port}`.bgGreen);
});
