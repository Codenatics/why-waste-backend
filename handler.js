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
  connection.query(query, [id + '%'], function (err, data) {
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

app.post("/addrestaurants", function (request, response) {
  const data = request.body;
  const query = `INSERT INTO Restaurants (Name, Address, PostCode, Email, TelNo)
   VALUES (?, ?, ?, ?, ? )`
  // Should make a SELECT * FROM Restaurants query to the DB and return the results
  connection.query(query, [data.Name, data.Address, data.PostCode, data.Email, data.TelNo], function (err, results) {
    if (err) {
      console.log("Error from MySQL", err);
      response.status(500).send(err);
    } else {
      connection.query(
        `SELECT * FROM Restaurants WHERE RestaurantId = ${results.insertId}`,
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


app.delete("/restaurants", function (request, response) {
  const data = request.body;
  const query = `DELETE q
  FROM Food q
  INNER JOIN Restaurants u on (u.RestaurantID = q.RestaurantID) 
  WHERE (Name = ? AND FoodType = ? AND UseByDate = ? )`
  // Should make a SELECT * FROM Restaurants query to the DB and return the results
  connection.query(query, [data.Name, data.FoodType, data.UseByDate], function (err) {
    if (err) {
      console.log("Error from MySQL", err);
      response.status(500).send(err);
    } else {
      response.status(200).send(`Deleted ${data.FoodType} with Use-by-date ${data.UseByDate} from ${data.Name}!`)

    }
  })


});

app.delete("/delrestaurants", function (request, response) {
  const data = request.body;
  const query = `DELETE FROM Restaurants WHERE Name = ? `
  // Should make a SELECT * FROM Restaurants query to the DB and return the results
  connection.query(query, [data.Name], function (err) {
    if (err) {
      console.log("Error from MySQL", err);
      response.status(500).send(err);
    } else {
      response.status(200).send(`Deleted ${data.Name}!`)

    }
  })


});

app.put("/restaurants", function (request, response) {
  const data = request.body;
  const query = `UPDATE Food A 
                 INNER JOIN Restaurants B on (A.RestaurantID = B.RestaurantID)
                 SET A.Quantity = ?
                 WHERE ( Name = ? AND FoodType = ? )`
  // Should make a SELECT * FROM Restaurants query to the DB and return the results
  connection.query(query, [data.Name, data.FoodType, data.Quantity], function (err) {
    if (err) {
      console.log("Error from MySQL", err);
      response.status(500).send(err);
    } else {
      response.status(200).send(`Updated ${data.FoodType} in ${data.Name} with ${data.Quantity}. Summary of data is ${JSON.stringify(data)}`);
    }
  });
});

module.exports.app = serverlessHttp(app);