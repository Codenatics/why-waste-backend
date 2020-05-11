# Backend for Why-Waste? App
This is the back end for an app (WhyWaste?) built as part of the TechReturners YJIT course. It connects to an RDS Database. The frontend of the app was built using ReactJS, and is available here

WhyWaste? connects Charities with Restaurants with surplus food available for any takers.

# API Endpoints
## GET /restaurant
 GET - https://z0akxs8ksh.execute-api.eu-west-1.amazonaws.com/dev/restaurant/{PostCode}
The GET API accepts a PostCode and returns a JSON list of meals available from various restaurants around the specified PostCode.

## POST /meal, /restaurant

  POST/meal - https://z0akxs8ksh.execute-api.eu-west-1.amazonaws.com/dev/meal
This POST API creates a new meal entry in the RDS when it receives a JSON body in the format:
{
	"FoodType": "Meatballs",
	"Quantity": 5,
	"UseByDate": "2020-05-30",
	"Name": "Pizza Hut"
}

  POST/restaurant - https://z0akxs8ksh.execute-api.eu-west-1.amazonaws.com/dev/restaurant
  This POST API creates a new restaurant entry in the RDS when it receives a JSON body in the format:
  {
	"Name": "Pizza Hut",
	"Address": "5, Boyle Lane",
	"PostCode": "TN1 8JQ",
	"Email": "hello@pizzahut.com",
    "TelNo": "0161 333 4959"
}

##DELETE
  DELETE/meal - https://z0akxs8ksh.execute-api.eu-west-1.amazonaws.com/dev/meal
This DELETE API deletes a meal entry from a named restaurant in the RDS when it receives a JSON body in the format:
  {
	"Name": "Pizza Hut",
    "FoodType": "Meatballs",
	"UseByDate": "2020-05-30"
}

  DELETE/restaurant - https://z0akxs8ksh.execute-api.eu-west-1.amazonaws.com/dev/restaurant
This DELETE API deletes a named restaurant entry from the RDS when it receives a JSON body in the format:
{
	"Name": "Pizza Hut"
}

##PUT
  PUT - https://z0akxs8ksh.execute-api.eu-west-1.amazonaws.com/dev/meal
This API will update the quantity of a named meal in a named restaurant. It receives the JSON body in the format:
{
        "Name": "Nando's",
        "FoodType": "Portobello Mushroom & Halloumi Burger",
        "Quantity": "21"
    }
