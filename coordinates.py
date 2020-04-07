# Dependencies
from bs4 import BeautifulSoup as bs
from splinter import Browser
import pandas as pd
import time
import requests
import json
import geopandas
from geopy.geocoders import Nominatim
import sqlite3

# Set executable path and initialize Chrome browser
executable_path = {"executable_path": "chromedriver.exe"}
browser = Browser("chrome", **executable_path, headless=True)

# Visit the backpacker website
url = "https://www.priceoftravel.com/world-cities-by-price-backpacker-index/"
browser.visit(url)

time.sleep(1)

# Find all cities in top list
top_cities_html = browser.html
top_cities_soup = bs(top_cities_html, "html.parser")

top_cities = top_cities_soup.find('div', class_ = "bpiidx_list").find_all('a', href=True)

places_list = []

for city in range(0,len(top_cities)):
        
    city_country_name = top_cities[city].text.replace("\n"," ").strip()
    places_list.append(city_country_name)

# Check places list
places_list

locator = Nominatim(user_agent="myGeocoder")

top_places = {}
latitude_list = []
longitude_list = []

for city in places_list:   
    try:
        location = locator.geocode(city)        
        
        latitude = location.latitude 
        longitude = location.longitude
            
    except:
        latitude = ""        
        longitude = ""
    
    latitude_list.append(latitude)        
    longitude_list.append(longitude)    
    
top_places['city_country'] = places_list
top_places['lat'] = latitude_list
top_places['lon'] = longitude_list

# put data into pandas dataframe
coords_df = pd.DataFrame(top_places, columns= ['city_country', 'lat', 'lon'])

# check if any city doesn't have a coord
empty_coords = coords_df[coords_df['lat']==""]
print(empty_coords)

# enter coords for San Pedro (Ambergris Caye), Belize
coords_df.loc[coords_df['city_country'] == "San Pedro (Ambergris Caye), Belize", 'lat'] = 18.0083682999
coords_df.loc[coords_df['city_country'] == "San Pedro (Ambergris Caye), Belize", 'lon'] = -87.9252862988

# check if data were correctly entered
coords_df.loc[coords_df['city_country'] == "San Pedro (Ambergris Caye), Belize"]

# connecting to sqlite
conn = sqlite3.connect('coords.db')
c = conn.cursor()

try:
    # Drop table if exists
    c.execute('DROP TABLE COORDS')
except:
    # Create table
    c.execute('CREATE TABLE COORDS (City_Country, Lat, Lon)')
    conn.commit()
    coords_df.to_sql('COORDS', conn, if_exists='replace', index = False)

# check if table in database is created

c.execute('''  
SELECT * FROM COORDS
          ''')

for row in c.fetchall():
    print(row)