//once the client is deployed, we should modify the fetch urls to the live one. To make it flexible, we could create an .env variable for the deployed URL and a utility variable to select the development or production one
const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_LOCAL_HOST
    : import.meta.env.VITE_SERVER_URL;

// const baseUrl = "http://localhost:5100";

export { baseUrl };

console.log("VITE_LOCAL_HOST:", import.meta.env.VITE_LOCAL_HOST);
console.log("VITE_SERVER_URL:", import.meta.env.VITE_SERVER_URL);
console.log("Current Mode:", import.meta.env.MODE);
console.log("Resolved baseUrl:", baseUrl);
