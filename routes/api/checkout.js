const express = require("express");
const router = express.Router();
const passport = require("passport");
const paypal = require("paypal-rest-sdk");

const CheckOut = require("../../models/Checkout");
const WorkRequest = require("../../models/WorkRequest");

paypal.configure({
  mode: "sandbox",
  client_id:
    process.env.client_id,
  client_secret:
    process.env.client_secret
});


router.post(`/pay`, (req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel"
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: req.body.title,
              sku: req.body.id.toString(),
              price: Number(req.body.offerAmount).toFixed(2),
              currency: "USD",
              quantity: 1
            }
          ]
        },
        amount: {
          currency: "USD",
          total: Number(req.body.offerAmount).toFixed(2)
        },
        description: "This is the payment description."
      }
    ]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.log(error.response);
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.status(200).json({ link: payment.links[i].href });
        }
      }
    }
  });
});

router.post("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: Number(req.body.amount).toFixed(2)
        }
      }
    ]
  };

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.log(error.response);
    } else {
      let transactionDetails = new CheckOut({
        paymentId: payment.id,
        payerInfo: payment.payer.payer_info,
        state: payment.state,
        cart: payment.cart,
        create_time: payment.create_time,
        work: req.body.work_id,
        user: req.body.user_id
      });

      transactionDetails
        .save()
        .then(() => {
          WorkRequest.findOneAndUpdate(
            { _id: transactionDetails.work },
            { $set: { status: 1, delivery_on: req.body.delivery_on } },
            { new: true }
          ).catch(e => console.log(e));
        })
        .catch(e => console.log(e));
      res.status(200).json({ status: "Success" });
    }
  });
});

router.get("/cancel", (req, res) => {
  res.send("cancelled");
});

module.exports = router;
