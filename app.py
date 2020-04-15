import numpy as np
from flask import render_template
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
import json


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///backpackers_index.db")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
climate_data = Base.classes.TEMP_PRCP

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################


@app.route("/")
def dashboard():
    return render_template("Dashbord.html")



@app.route("/climate")
def climate():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of passenger data including the name, age, and sex of each passenger"""
    # Query all passengers
    results = session.query(climate_data.city_country, 
                            climate_data.month, 
                            climate_data.high_temp,
                            climate_data.low_temp,
                            climate_data.prcp_inch,
                            ).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_climate = []
    for city_country, month, high_temp, low_temp, prcp_inch in results:
        climate_dict = {}
        climate_dict["city_country"] = city_country
        climate_dict["Month"] = month
        climate_dict["High Temp"] = high_temp
        climate_dict["Low Temp"] = low_temp
        climate_dict["Precipitation"] = prcp_inch
        all_climate.append(climate_dict)

    return jsonify(all_climate)


if __name__ == '__main__':
    app.run(debug=True)

