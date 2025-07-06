const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const payOS = require("./utils/payos");

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", express.static("public"));
app.use("/payment", require("./controllers/payment-controller"));
app.use("/order", require("./controllers/order-controller"));
app.post("/create-payment-link", async (req, res) => {
  const YOUR_DOMAIN = "http://localhost:5000";

  const { amount } = req.body; 

  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: parseInt(amount), 
    description: "Chuyển tiền cho Shew",
    returnUrl: `${YOUR_DOMAIN}/success.html`,
    cancelUrl: `${YOUR_DOMAIN}/cancel.html`,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);
    res.redirect(paymentLinkResponse.checkoutUrl);
  } catch (error) {
    console.error(error);
    res.send("Something went wrong");
  }
});

app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}`);
});
