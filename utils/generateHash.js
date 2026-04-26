const bcrypt = require("bcrypt");

// super admin
// const password = "admin123";

//admin
const password = "admin";

bcrypt.hash(password, 10).then((hash) => {
  console.log("HASH:", hash);
});
