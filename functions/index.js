// module.exports = {
//   ...require("./controllers/user"),
// };

/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable object-curly-spacing */
// const functions = require("firebase-functions");
// const express = require("express");
// const cors = require("cors");
// const fetch = require("node-fetch");

import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import admin from "firebase-admin";
// const admin = require("firebase-admin");
admin.initializeApp();
const app = express();
const db = admin.firestore();
import validateFirebaseIdToken from "./authMiddleware.js";
// const validateFirebaseIdToken = require("./validateFirebaseIdToken");
app.use(cors({ origin: true }));

app.get("/", async (req, res) => {
  const snapshot = await db.collection("users").get();

  let users = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    users.push({ id, ...data });
  });
  res.status(200).send(JSON.stringify(users));
});

app.get("/:id", validateFirebaseIdToken, async (req, res) => {
  const snapshot = await db.collection("users").doc(req.params.id).get();

  const userId = snapshot.id;
  const userData = snapshot.data();

  res.status(200).send(JSON.stringify({ id: userId, ...userData }));
});

app.post("/", validateFirebaseIdToken, async (req, res) => {
  const user = req.body;
  await db.collection("users").add(user);
  res.status(201).send();
});

app.put("/:id", validateFirebaseIdToken, async (req, res) => {
  const body = req.body;

  await db.collection("users").doc(req.params.id).update(body);

  res.status(200).send();
});

app.delete("/:id", validateFirebaseIdToken, async (req, res) => {
  await db.collection("users").doc(req.params.id).delete();

  res.status(200).send();
});

app.post("/signup", async (req, res) => {
  const { email, password, returnSecureToken } = req.body;
  fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCC1-wFAEcY_AFH-s8LPuTCBtVC1TqFHmg",
    {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    }
  )
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
});

export const user = functions.region("asia-southeast2").https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
