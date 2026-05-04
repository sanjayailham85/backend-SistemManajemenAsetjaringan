if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || "1d",
};

module.exports = jwtConfig;
