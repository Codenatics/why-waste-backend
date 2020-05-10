// import express from "express";
// React apps get Transpiled
// This version of NodeJS does support import statements and there is no transpilation step

const serverlessHttp = require("serverless-http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "WhatWaste",
});

// Logically separate 4 sections of code according to the method of the HTTP request received

// Export a single function, called app

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/restaurants/:PostCode", function (request, response) {
  // const data = request.body;
  const id = request.params.PostCode;
  const query = `SELECT Name,FoodType,Quantity FROM Restaurants 
  JOIN Food ON Restaurants.RestaurantId = Food.RestaurantId
  WHERE PostCode LIKE ?`
  // Should make a SELECT * FROM Restaurants query to the DB and return the results
  connection.query(query, [id+'%'], function (err, data) {
    if (err) {
      console.log("Error from MySQL", err);
      response.status(500).send(err);
    } else {
      response.status(200).send(data);
    }
  });
});

app.post("/restaurants", function (request, response) {
  const data = request.body;
  const query = `INSERT INTO Food (FoodType, Quantity, UseByDate, RestaurantID)
   VALUES (?, ?, ?, (select RestaurantId from Restaurants where Name = ? ))`
  // Should make a SELECT * FROM Restaurants query to the DB and return the results
  connection.query(query, [data.FoodType, data.Quantity, data.UseByDate, data.Name], function (err, results) {
    if (err) {
      console.log("Error from MySQL", err);
      response.status(500).send(err);
    } else {
      connection.query(
        `SELECT * FROM Food WHERE FoodId = ${results.insertId}`,
        function (err, results) {
          if (err) {
            console.log("Error from MySQL", err);
            response.status(500).send(err);
          } else {
            response.status(201).send(results[0]);
          }
        }
      );
    }
  }
);
});

module.exports.app = serverlessHttp(app);