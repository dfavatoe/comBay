//REVIEW[epic=deploy, seq=4] 4-once the client is deployed, we should modify the fetch urls to the live one. To make it flexible, we could create an .env variable for the deployed URL and a utility variable to select the development or production one
const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_LOCAL_HOST
    : import.meta.env.VITE_SERVER_URL;

export { baseUrl };
