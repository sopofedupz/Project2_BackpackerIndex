# Dependencies
from bs4 import BeautifulSoup as bs
from splinter import Browser
import time
import json
import pandas as pd
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
daily_total = top_cities_soup.find('div', class_ = "bpiidx_list").find_all('div', class_="bpidx price")

# create a dict for each set of information type
city_facts_dict = {}
transport_dict = {}
food_drinks_dict = {}
temp_prcp_dict = {}

# create all the lists that we need to store the information
places_list = []
rank_list = []
daily_total_list = []
population_list = []
metro_list = []
timezone_list = []
currency_list = []
airport_list = []
transport_city_list = []
transport_mode_list = []
transport_price_list = []
food_city_list = []
food_type_list = []
food_desc_list = []
food_price_list = []
temp_prcp_cityList = []
month_list = []
high_temp_list = []
low_temp_list = []
prcp_inch_list = []

for city in range(0,len(top_cities)):
        
    city_country_name = top_cities[city].text.replace("\n"," ").strip()
    places_list.append(city_country_name)
    
    # get daily total
    city_daily_total = daily_total[city]
    city_daily_total = city_daily_total.text.replace("\n"," ").strip()
    daily_total_list.append(city_daily_total)

    # get the links to each of the top cities page
    top_city = top_cities[city]
    top_cities_link = top_city.get_attribute_list('href')[0]
    browser.visit(top_cities_link)

    #######################
    # Scrape facts table
    #######################
    try:
        # getting the city facts
        browser_html = browser.html
        browser_soup = bs(browser_html, "html.parser")
        
        population = browser_soup.find("table", class_ = "col city-facts").find_all('td', class_ = "white")[0]
        population = population.text.replace("\n"," ").strip()

        metro = browser_soup.find("table", class_ = "col city-facts").find_all('td', class_ = "white")[1]
        metro = metro.text.replace("\n"," ").strip()

        timezone = browser_soup.find("table", class_ = "col city-facts").find_all('td', class_ = "white")[2]
        timezone = timezone.text.replace("\n"," ").strip()

        currency = browser_soup.find("table", class_ = "col city-facts").find_all('td', class_ = "white")[3]
        currency = currency.text.replace("\n"," ").strip()

        airport = browser_soup.find("table", class_ = "col city-facts").find_all('td', class_ = "white")[4]
        airport = airport.text.replace("\n"," ").strip()
          
    except AttributeError:
        population = ""
        metro = ""
        timezone = ""
        currency = ""
        airport = ""

    # append data to lists
    rank_list.append(city+1)
    population_list.append(population)
    metro_list.append(metro)
    timezone_list.append(timezone)
    currency_list.append(currency)
    airport_list.append(airport)
    
    ################################
    # Scrape transportation prices
    ################################

    try:
        # Gather transportation information
        
        browser_html = browser.html
        browser_soup = bs(browser_html, "html.parser")
        
        transport_table = browser_soup.find("table", class_ = "fcol fcol-padding").find_all('tr', class_ = "border no-pad")
        
        for transport in range(0,len(transport_table)):
            
            # get transport mode/type
            transport_mode = transport_table[transport].find('td', class_="white")
            transport_mode = transport_mode.text.replace("\n"," ").strip()
            transport_mode_list.append(transport_mode)

            # get transportation price
            transport_price = transport_table[transport].find('td', class_="white2")
            transport_price = transport_price.text.replace("\n"," ").strip()
            transport_price_list.append(transport_price)
            
            # get country list
            transport_city_list.append(city_country_name)
                               
    except AttributeError:
        pass
    
    ################################
    # Scrape food and drink prices
    ################################
    
    # Gather food information
    try:
        browser_html = browser.html
        browser_soup = bs(browser_html, "html.parser")
        
        food_table = browser_soup.find_all("table", class_ = "fcol fcol-padding")[1]
        food_table = food_table.find_all('td', class_ = "white")
        
        for food in range(0,len(food_table),3):  

            # get food type
            food_type = food_table[food].text.replace("\n"," ").strip()
            food_type_list.append(food_type)

            # get description
            food_desc = food_table[food+1].text.replace("\n"," ").strip()
            food_desc_list.append(food_desc)

            # get food price
            food_price = food_table[food+2].text.replace("\n"," ").strip()
            food_price_list.append(food_price)
            
            # get country list
            food_city_list.append(city_country_name)

    except AttributeError:
        pass
        
    ########################################
    # Scrape temperature & precipitation
    ########################################
    
    try:
        browser_html = browser.html
        browser_soup = bs(browser_html, "html.parser")
        
        table = browser_soup.find("table", class_ = "center-table weather-tab").find_all("td")

        # Gather temperature and precipitation information
        for data in range(0,len(table),4):

            # get month
            month = table[data].text.replace("\n"," ").strip()
            month_list.append(month)

            # get high temp
            hi_temp = table[data+1].text.replace("\n"," ").strip()
            high_temp_list.append(hi_temp)

            # get low temp
            lo_temp = table[data+2].text.replace("\n"," ").strip()
            low_temp_list.append(lo_temp)

            # get precipitation in inches
            prcp = table[data+3].text.replace("\n"," ").strip()
            prcp_inch_list.append(prcp)
            
            # get country list
            temp_prcp_cityList.append(city_country_name)

    except AttributeError:
        pass

    time.sleep(1)

browser.quit()

###################
# put into a dict
###################

# city facts table
city_facts_dict['city_country'] = places_list
city_facts_dict['rank'] = rank_list 
city_facts_dict['daily_total_value'] = daily_total_list
city_facts_dict['population'] = population_list
city_facts_dict['metro'] = metro_list
city_facts_dict['timezone'] = timezone_list
city_facts_dict['currency'] = currency_list
city_facts_dict['airport'] = airport_list

# transportation table
transport_dict['city_country'] = transport_city_list
transport_dict['transport_mode'] = transport_mode_list
transport_dict['transport_price'] = transport_price_list

# food and drinks table
food_drinks_dict['city_country'] = food_city_list
food_drinks_dict['food_drinks_type'] = food_type_list
food_drinks_dict['food_drinks_desc'] = food_desc_list
food_drinks_dict['food_drinks_price'] = food_price_list

# temperature and precipitation table
temp_prcp_dict['city_country'] = temp_prcp_cityList
temp_prcp_dict['month'] = month_list
temp_prcp_dict['high_temp'] = high_temp_list
temp_prcp_dict['low_temp'] = low_temp_list
temp_prcp_dict['prcp_inch'] = prcp_inch_list

##################################
# put data into pandas dataframe
##################################
city_facts_df = pd.DataFrame.from_dict(city_facts_dict)
transport_df = pd.DataFrame.from_dict(transport_dict)
food_drinks_df = pd.DataFrame.from_dict(food_drinks_dict)
temp_prcp_df = pd.DataFrame.from_dict(temp_prcp_dict)

####################
# check dataframes
####################

print(city_facts_df.describe())
print(transport_df.groupby(['city_country']).count())
print(food_drinks_df.groupby(['city_country']).count())
print(temp_prcp_df.groupby(['city_country']).count())