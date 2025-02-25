const avatarUpload = async (req, res) => {
  console.log("avatarUpload working");
  console.log("req file :>> ", req.file);
};

const register = async (req, res) => {
  console.log("register working");
  console.log("req :>> ", req);
};

export { register, avatarUpload };
