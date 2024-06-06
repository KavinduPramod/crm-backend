require("dotenv").config();
const express = require("express");
const customerRoutes = require("./routes/customerRoutes");
const userRoutes = require("./routes/userRoutes");
const businessEntityRoutes = require("./routes/businessEntityRoutes");
const transactionSMSRoutes = require("./routes/transactionSMSRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const testRoutes = require("./routes/testRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const newSMSController = require("./routes/newSMSControllerRoutes");
const businessMaster = require("./routes/businessMasterRoutes");
const newMMSController = require("./routes/newMMSControllerRoutes");
const homeRoutes = require("./routes/homeRoutes");
const newWhatsappController = require("./routes/newWhatsappControllerRoutes")
const calenderRoutes = require("./routes/calenderControllerRoutes")
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/user", userRoutes);
app.use("/api/businessEntity", businessEntityRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/transactionSMS", transactionSMSRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/test", testRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/newSMS", newSMSController);
app.use("/api/businessMaster", businessMaster);
app.use("/api/newMMS", newMMSController);
app.use("/api/home", homeRoutes);
app.use("/api/newWhatsapp", newWhatsappController);
app.use("/api/calendar", calenderRoutes);



const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
