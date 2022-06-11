/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable object-curly-spacing */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();
const userApp = express();
const db = admin.firestore();

userApp.use(cors({ origin: true }));

userApp.get("/", async (req, res) => {
  const snapshot = await db.collection("users").get();

  let users = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    users.push({ id, ...data });
  });
  res.status(200).send(JSON.stringify(users));
});

userApp.get("/:id", async (req, res) => {
  const snapshot = await db.collection("users").doc(req.params.id).get();

  const userId = snapshot.id;
  const userData = snapshot.data();

  res.status(200).send(JSON.stringify({ id: userId, ...userData }));
});

userApp.post("/", async (req, res) => {
  const user = req.body;
  await db.collection("users").add(user);
  res.status(201).send();
});

userApp.put("/:id", async (req, res) => {
  const body = req.body;

  await db.collection("users").doc(req.params.id).update(body);

  res.status(200).send();
});

userApp.delete("/:id", async (req, res) => {
  await db.collection("users").doc(req.params.id).delete();

  res.status(200).send();
});

exports.user = functions.https.onRequest(userApp);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
