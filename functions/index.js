/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin/app");
const totalAdmin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

admin.initializeApp();
const db = totalAdmin.firestore();

const stripe = require("stripe")(
  "sk_test_51OqvFPCdjKZhZCnHtXYpmp7QPhXZWRHWciBP0x0Nfbm07rRyOnSQNKdpPJAuYlrVHHqkW2Y0UlPed0n9OTIZa7lM00wbw3wqQp"
);

exports.createPaymentIntent = onRequest(async (request, response) => {
  try {
    const { price, userId } = request.body;

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      throw new Error("User Not Found");
    }

    const user = userDoc.data();

    // get the customer id of the user
    let customer = null;
    if (!user.customerId) {
      const temp = await stripe.customers.create({
        email: user.email ,
        name: user.fullName || "Anonymous",
      });
      customer = temp.id;


      await db.collection("users").doc(userId).update({ customerId: customer });
    } else {
      // if user already has a customer id then use that
      customer = user.customerId;
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer },
      { apiVersion: "2022-08-01" }
    );

    const payload = {
      amount: price * 100,
      currency: "usd",
      customer: customer,
      payment_method_types: ["card"],
    };

    // create a payment intent
    const paymentIntent = await stripe.paymentIntents.create(payload);

    if (!paymentIntent) {
      throw new Error("Payment Failed");
    }

    response.status(200).json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customerId: customer,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    response.status(500).send("Internal Server Error");
  }
});
// //////////////////////////////////////////////////////

exports.createConnectedAccount = onRequest(async (request, response) => {
  try {
    const { userId } = request.body;

    console.log("====================================");
    console.log("====================================");
    console.log("====================================");
    console.log("====================================");
    console.log("====================================");
    console.log(request.body, "fhsfbvdjhfv");
    console.log("====================================");
    console.log("====================================");
    console.log("====================================");
    console.log("====================================");
    console.log("====================================");
    console.log("====================================");

    // Fetch seller details from Firestore
    const sellerDetailsDoc = await db
      .collection("sellerDetails")
      .doc(userId)
      .get();

    if (!sellerDetailsDoc.exists) {
      throw new Error("User Not Found");
    }

    const sellerDetails = sellerDetailsDoc.data();

    let accountId = null;
    accountId = sellerDetails.accountId;

    //check if user is already linked or not
    if (accountId) {
      //stripe accountInfo
      let accountInfo = await stripe.accounts.retrieve(accountId);
      if (accountInfo.charges_enabled) {
        return response.status(200).json({
          status: "OK",
          data: { msg: "Already Linked", linked: true },
        });
      }
    }

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      accountId = account.id;
      if (!accountId) {
        throw new Error("Something went wrong Account not created");
      }

      // Update accountId in Firestore
      await db.collection("sellerDetails").doc(userId).update({
        accountID: accountId,
        stripeLinkingProcessFinished:true
      });
    }

    let returnUrl = `https://currentvpn.netlify.app/ThankYou`;

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `https://currentvpn.netlify.app/ThankYou`,
      return_url: returnUrl,
      type: "account_onboarding",
    });
    const { url } = accountLink;
    if (!url) {
      throw new Error("Something went wrong Account Link not created");
    }

    return response.status(200).json({
      status: "OK",
      data: { res: accountLink, returnUrl, msg: "Not Linked", linked: false },
    });
  } catch (error) {
    console.error("Error creating connected account:", error);
    response.status(500).send("Internal Server Error From Here Suleman");
  }
});
//  from platform to app owner
exports.payOut = onRequest(async (request, response) => {
  try {
    let { amount } = request.body;
    const payout = await stripe.payouts.create({
      amount: amount,
      currency: "usd",
    });

    if (!payout) {
      return new Error("Something went wrong Payout unsuccessfull");
    }

    return response.status(200).json({
      status: "OK",
      data: payout,
    });
  } catch (err) {
    return next(err);
  }
});

// //////////////////////////////////////////////////////
//stripe money transafer to Merchant
exports.transferMoney = onRequest(async (request, response) => {
  try {
    let { amount, userId } = request.body;

    let accountId = null;

    // get account id from sellerDetails collection in Firestore where userId is equal to userId
    const sellerDetailsDoc = await db
      .collection("sellerDetails")
      .doc(userId)
      .get();

    if (!sellerDetailsDoc.exists) {
      return response.status(200).json({
        status: false,
        data: "User Not Found",
      });
    }

    const sellerDetails = sellerDetailsDoc.data();

    accountId = sellerDetails.accountID;

    if (!accountId) {
      return response.status(200).json({
        status: false,
        data: "User is not Connected with Stripe yet",
      });
    }

    let accountInfo = await stripe.accounts.retrieve(accountId);

    if (!accountInfo) {
      return response.status(200).json({
        status: false,
        data: "Account Not Found",
      });
    }
    if (accountInfo.charges_enabled === false) {
      return response.status(200).json({
        status: false,
        data: "Account is not Completely Connected with Stripe yet",
      });
    }
    console.log("=======================================")
    console.log("=======================================")
    console.log("transafer")
    console.log("=======================================")
    console.log("=======================================")
    const transafer = await stripe.transfers.create({
      amount: amount * 100,
      currency: "usd",
      destination: accountId,
      transfer_group: userId.toString(),
    });

    if (!transafer) {
     return response.status(200).json({
        status: false,
        data: "Something went wrong Transfer not created",
      });
    }

    return response.status(200).json({
      status: "OK",
      data: transafer,
    });
  } catch (err) {
    return response.status(400).json({
      status: false,
      data: err,
    });;
  }
});
