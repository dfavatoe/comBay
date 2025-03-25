import jwt from "jsonwebtoken";

const generateToken = (userId, userRole) => {
  const payload = { sub: userId, role: userRole };

  const options = {
    expiresIn: "1d",
    issuer: "comBay",
  };

  const secretOrPrivateKey = process.env.JWT_SECRET;

  const jwtToken = jwt.sign(payload, secretOrPrivateKey, options);
  if (!jwtToken) return null;

  if (jwtToken) return jwtToken;
};

export { generateToken };
