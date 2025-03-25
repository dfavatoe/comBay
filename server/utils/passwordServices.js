import bcrypt from "bcrypt";
//encrypts the user's password
const hashingPassword = async (password) => {
  const saltRounds = 10;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log("error hashing password :>> ", error);
  }
};
//verifies if the user's password 'matches' the encrypted password
const verifyPassword = async (plainPassword, hashedPassword) => {
  const isPasswordCorrect = await bcrypt.compare(plainPassword, hashedPassword);

  return isPasswordCorrect;
};

export { hashingPassword, verifyPassword };
