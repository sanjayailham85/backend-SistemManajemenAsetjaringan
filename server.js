const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// socket
const { initSocket } = require("./utils/sockets");
initSocket(server);

// routes
const rackRoutes = require("./routes/rack.routes");
const physicalRoutes = require("./routes/physical.routes");
const hostRoutes = require("./routes/host.routes");
const guestRoutes = require("./routes/guest.routes");
const accessPointRoutes = require("./routes/accessPoint.routes");
const switchRoutes = require("./routes/switch.routes");
const cctvRoutes = require("./routes/cctv.routes");
const routerRoutes = require("./routes/router.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const authRoutes = require("./routes/auth.routes");
const searchRoutes = require("./routes/search.routes");
const osVersionRoutes = require("./routes/osVersion.routes");
const deviceMonitoringRoutes = require("./routes/deviceMonitoring.routes");

// static & api
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);

app.use("/api/rack", rackRoutes);
app.use("/api/physical", physicalRoutes);
app.use("/api/host", hostRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/accessPoint", accessPointRoutes);
app.use("/api/switch", switchRoutes);
app.use("/api/cctv", cctvRoutes);
app.use("/api/router", routerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/osVersion", osVersionRoutes);
app.use("/api/monitoring", deviceMonitoringRoutes);

// root
app.get("/", (req, res) => {
  res.json({ message: "Backend running ✅" });
});

// monitoring worker
const runMonitoring = require("./workers/monitoring.worker");

// start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // worker jalan setelah server benar-benar siap
  setInterval(runMonitoring, 10000);
});
