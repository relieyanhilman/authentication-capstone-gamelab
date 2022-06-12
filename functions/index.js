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
  try {
    const snapshot = await db.collection("users").get();

    let users = [];
    snapshot.forEach((doc) => {
      let id = doc.id;
      let data = doc.data();

      users.push({ id, ...data });
    });
    res.status(200).send(JSON.stringify(users));
  } catch (err) {
    res.send({ message: err });
  }
});

//query parameter :id adalah email
app.get("/:id", async (req, res) => {
  try {
    const snapshot = await db.collection("users").doc(req.params.id).get();

    const userId = snapshot.id;
    const userData = snapshot.data();
    if (!userData) {
      throw Error("User not found");
    }
    res.status(200).send(JSON.stringify({ id: userId, ...userData }));
  } catch (error) {
    res.send({ message: error.message });
  }
});

app.post("/", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    await db.collection("users").doc(email).set({ email, username, password });
    res.status(201).send("user created");
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

//query parameter :id adalah email
app.put("/:id", async (req, res) => {
  try {
    const body = req.body;

    await db.collection("users").doc(req.params.id).update(body);

    res.status(200).send("user updated");
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

//query parameter :id adalah email
app.delete("/:id", async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).delete();

    res.status(200).send("user deleted");
  } catch (err) {
    res.send({ message: err });
  }
});

export const user = functions.region("asia-southeast2").https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
