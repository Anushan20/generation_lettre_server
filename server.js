const express = require("express");
const app = express();
const { resolve } = require("path");
var cors = require('cors');
var bodyParser = require('body-parser');
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

//app.use(express.static(process.env.STATIC_DIR));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.get("/get-api-key", (req, res) => {
  res.send({
    publishableKey: process.env.OPENAI_API_KEY,
  });
});


app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 199,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.set('Content-Type', 'application/json');
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.post("/create-payment-intent-business", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 199,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.set('Content-Type', 'application/json');
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});


app.get("/get_paiement_intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      req.query.paiementId
    );
    res.send({
      paiementIntent: paymentIntent,
    })
  }
  catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
})

app.listen(5252, () =>
  console.log(`Node server listening at http://localhost:5252`)
);
