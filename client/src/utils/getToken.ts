//function not used: we are using the useUserStatus custom hook instead.
const getToken = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return token;
  } else {
    return null;
  }
};

export default getToken;
