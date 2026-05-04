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
app.use("/uploads", express.static("uploads"));

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
const locationRoutes = require("./routes/location.routes");
const AccessPointMerkRoutes = require("./routes/accessPointMerk.routes");
const CCTVMerkRoutes = require("./routes/cctvMerk.routes");
const AccessPointControllerRoutes = require("./routes/accessPointController.routes");
const CCTVControllerRoutes = require("./routes/cctvController.routes");
const merkRoutes = require("./routes/merk.routes");
const deviceMonitoringRoutes = require("./routes/deviceMonitoring.routes");
const activityLogRoutes = require("./routes/activityLog.routes");
const exportRoutes = require("./routes/export.routes");
const importRoutes = require("./routes/import.routes");
const ipListRoutes = require("./routes/ipList.routes");

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/activitylog", activityLogRoutes);

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
app.use("/api/location", locationRoutes);
app.use("/api/accessPointMerk", AccessPointMerkRoutes);
app.use("/api/cctvMerk", CCTVMerkRoutes);
app.use("/api/accessPointController", AccessPointControllerRoutes);
app.use("/api/cctvController", CCTVControllerRoutes);
app.use("/api/merk", merkRoutes);
app.use("/api/monitoring", deviceMonitoringRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/import", importRoutes);
app.use("/api/ipList", ipListRoutes);

// root
app.get("/", (req, res) => {
  res.json({ message: "Backend running ✅" });
});

const runMonitoring = require("./workers/monitoring.worker");

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  setInterval(runMonitoring, 10000);
});
