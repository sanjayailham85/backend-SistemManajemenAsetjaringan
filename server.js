const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const rackRoutes = require("./routes/rack.routes");
const physicalRoutes = require("./routes/physical.routes");
const hostRoutes = require("./routes/host.routes");
const guestRoutes = require("./routes/guest.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const authRoutes = require("./routes/auth.routes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ message: "Backend Asset Management running ✅" });
});

app.use("/api/rack", rackRoutes);
app.use("/api/physical", physicalRoutes);
app.use("/api/host", hostRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
