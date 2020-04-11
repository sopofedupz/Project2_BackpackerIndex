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

engine = create_engine("sqlite:///backpackers_index.db")

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


@app.route("/api/v1.0/COORDS")
def coordsRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    #Return a list of all cities +lat + long"""
    
    city_coords = session.query(coords.CITY_COUNTRY, coords.LAT, coords.LON).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_coords = []
    for row in city_coords:
        all_coords.append({"CITY_COUNTRY": row[0],
                           "LAT": row[1],
                           "LON": row[2]})

        # })
        # coord_dict = {}
        # coord_dict["CITY_COUNTRY"] = NAME
        # coord_dict["LAT"] = LAT
        # coord_dict["LON"] = LON
        
        # all_coords.append(coord_dict)

    return jsonify(all_coords)


@app.route("/api/v1.0/city_facts")
def factsRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    #Return a list of cities + facts
    city_facts = session.query(facts.CITY_COUNTRY, facts.RANK, facts.DAILY_TOTAL_VALUE, facts.POPULATION, facts.METRO, facts.TIMEZONE, facts.CURRENCY, facts.AIRPORT ).all()
    session.close()
    # Create a dictionary from the row data and append to a list of all_facts
    all_cities = []
    for row in city_facts:
        all_cities.append({" CITY_COUNTRY": row[0],
                           "RANK": row[1],
                           "DAILY_TOTAL_VALUE": row[2],
                           "POPULATION": row[3],
                           "METRO": row[4],
                           "TIMEZONE": row[5],
                           "CURRENCY": row[6],
                           "AIRPORT": row[7]})
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















