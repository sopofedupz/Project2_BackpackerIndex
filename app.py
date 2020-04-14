# Import the functions we need from flask
from flask import Flask
from flask import render_template 
from flask import jsonify

# Import the functions we need from SQL Alchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import numpy as np

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///backpackers_index.db",
                        echo=True,
                        connect_args={"check_same_thread": False})

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
coords = Base.classes.COORDS
facts = Base.classes.CITY_FACTS



#################################################
# Flask Routes
#################################################


@app.route("/")
def IndexRoute():
    webpage = render_template("index.html")
    return webpage

# Route to our dashboard page
@app.route("/Dashboard.html")
def dashboard():
    print("works fine in Dashboard.html")
    return render_template("Dashboard.html")

# Route to our comparison page
@app.route("/Comparison.html")
def comparison():
    print("works fine in Comparison.html")
    return render_template("Comparison.html")

# Route to our team page
@app.route("/Team.html")
def team():
    print("works fine in Team.html")
    return render_template("Team.html")


# @app.route("/other")
# def welcome():
#     """List all available api routes."""
#     return (
#         "Available Routes:<br/>"
#         "/api/v1.0/COORDS<br/>"
#         "/api/v1.0/CITY_FACTS"
#     )


@app.route("/api/v1.0/coordsData")
def coordsRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    #Return a list of all cities +lat + long"""
    
    city_coords = session.query(coords.city_country, coords.lat, coords.lon).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_coords = []
    for row in city_coords:
        all_coords.append({"city_country": row[0],
                           "lat": row[1],
                           "lon": row[2]})
 
    return jsonify(all_coords)

    # cityCoordList = ["CITY_COUNTRY", "LAT", "LON"]
    # all_coords = {}
    # for item in city_coords:
    #     CITY_COUNTRY = item[0]
    #     LAT = item[1]
    #     LON = item[2]
    #     for key in all_coords:
    #         if CITY_COUNTRY == key:
    #             for city in cityCoordList:
    #                 test = {city: LAT} 
    #                 all_coords[key] [CITY_COUNTRY] = {"coords": test}
    #                 found = True
    #             if not found:
    #                 for city in ityCoordList:
    #                     test = {city: LAT}
    #                 all_coords[CITY_COUNTRY] = { CITY_COUNTRY: {"coords": test}}

    # return all_coords







    

@app.route("/api/v1.0/facts")
def factsRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    #Return a list of cities + facts
    city_facts = session.query(facts.city_country, facts.rank, facts.daily_total_value, facts.population, facts.metro, facts.timezone, facts.currency, facts.airport ).all()
    session.close()
    # Create a dictionary from the row data and append to a list of all_facts
    all_cities = []
    for row in city_facts:
        all_cities.append({"city_country": row[0],
                           "rank": row[1],
                           "daily_total_value": row[2],
                           "population": row[3],
                           "metro": row[4],
                           "timezone": row[5],
                           "currency": row[6],
                           "airport": row[7]})
        # city_dict = {}
        # city_dict["CITY_COUNTRY"] = NAME
        # city_dict["RANK"] = RANK
        # city_dict["DAILY_TOTAL_VALUE"] = DAILY_TOTAL_VALUE
        # city_dict["POPULATION"] = POPULATION
        # city_dict["METRO"] = METRO
        # city_dict["TIMEZONE"] = TIMEZONE
        # city_dict["CURRENCY"] = CURRENCY
        # city_dict["AIRPORT"] = AIRPORT
        # all_cities.append(city_dict)

    return jsonify(all_cities)
    session.close()

@app.route("/test")
def TestRoute():
    ''' This function returns a simple message, just to guarantee that
        the Flask server is working. '''

    return "This is the test route!"
    session.close()





if __name__ == '__main__':
    app.run(debug=True)















