# Dependencies
from bs4 import BeautifulSoup as bs
from splinter import Browser
import time
import json

# Set executable path and initialize Chrome browser
executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
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

top_cities_info = []
places_list = []

for city in range(0,len(top_cities)):
        
    city_state_name = top_cities[city].text.replace("\n"," ").strip()
    places_list.append(city_state_name)
    
    # get city and state name
    city_name = city_state_name.split(", ")[0]
    country_name = city_state_name.split(", ")[1]
    
    # get daily total
    city_daily_total = daily_total[city]
    city_daily_total = city_daily_total.text.replace("\n"," ").strip()

    # get the links to each of the top cities page
    top_city = top_cities[city]
    top_cities_link = top_city.get_attribute_list('href')[0]
    browser.visit(top_cities_link)
    
    # creating a dict
    city_info_dict = {}
    
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
        
        # Create a dict to store the information
        city_facts = []
        city_facts_dict = {}
        city_facts_dict['city'] = city_name
        city_facts_dict['country'] = country_name
        city_facts_dict['rank'] = city+1
        city_facts_dict['city_daily_total'] = city_daily_total
        city_facts_dict['population'] = population
        city_facts_dict['metro_area'] = metro
        city_facts_dict['timezone'] = timezone
        city_facts_dict['currency'] = currency
        city_facts_dict['airport'] = airport

        # append dict to list
        city_facts.append(city_facts_dict)       
        
    except AttributeError:
        pass

    # add data to the larger dict
    city_info_dict["city_facts"] = city_facts
                    
    ################################
    # Scrape transportation prices
    ################################
    
    transport_list = []

    try:
        # Gather transportation information
        
        browser_html = browser.html
        browser_soup = bs(browser_html, "html.parser")
        
        transport_table = browser_soup.find("table", class_ = "fcol fcol-padding").find_all('tr', class_ = "border no-pad")

        
        for transport in range(0,len(transport_table)):
            
            # create an empty dict
            transport_dict = {}
        
            # get transport mode/type
            transport_mode = transport_table[transport].find('td', class_="white")
            transport_mode = transport_mode.text.replace("\n"," ").strip()

            # get transportation price
            transport_price = transport_table[transport].find('td', class_="white2")
            transport_price = transport_price.text.replace("\n"," ").strip()
                       
            # put everything in a dict
            transport_dict['city'] = city_name
            transport_dict['country'] = country_name
            transport_dict['transport_mode'] = transport_mode
            transport_dict['transport_price'] = transport_price

            # append dict to the transport list
            transport_list.append(transport_dict)
        
    except AttributeError:
        pass
        
    # add data to the larger dict
    city_info_dict["transportation"] = transport_list
                            
    ################################
    # Scrape food and drink prices
    ################################
        
    food_list = []
    
    # Gather food information
    try:
        browser_html = browser.html
        browser_soup = bs(browser_html, "html.parser")
        
        food_table = browser_soup.find_all("table", class_ = "fcol fcol-padding")[1]
        food_table = food_table.find_all('td', class_ = "white")
        
        for food in range(0,len(food_table),3):  
                
            # create an empty dict
            food_dict = {}

            # get food type
            food_type = food_table[food].text.replace("\n"," ").strip()

            # get description
            food_desc = food_table[food+1].text.replace("\n"," ").strip()

            # get food price
            food_price = food_table[food+2].text.replace("\n"," ").strip()

            # put everything in a dict
            food_dict['city'] = city_name
            food_dict['country'] = country_name
            food_dict['food_type'] = food_type
            food_dict['food_desc'] = food_desc
            food_dict['food_price'] = food_price

            # append dict to the food list
            food_list.append(food_dict)
    
    except AttributeError:
        pass
        
    # add data to the larger dict
    city_info_dict["food"] = food_list
        
    ########################################
    # Scrape temperature & precipitation
    ########################################
    
    temp_prcp_list = []
    
    try:
        browser_html = browser.html
        browser_soup = bs(browser_html, "html.parser")
        
        table = browser_soup.find("table", class_ = "center-table weather-tab").find_all("td")

        # Gather temperature and precipitation information
        for data in range(0,len(table),4):

            month_dict = {}
            month_list = []
            hi_temp_list = []
            lo_temp_list = []
            prcp_list = []

            # get month
            month = table[data].text.replace("\n"," ").strip()

            # get high temp
            hi_temp = table[data+1].text.replace("\n"," ").strip()

            # get low temp
            lo_temp = table[data+2].text.replace("\n"," ").strip()

            # get precipitation in inches
            prcp = table[data+3].text.replace("\n"," ").strip()

            # append the dicts to list
            month_dict['city'] = city_name
            month_dict['country'] = country_name
            month_dict['month'] = month
            month_dict['high_temp'] = hi_temp
            month_dict['low_temp'] = lo_temp
            month_dict['prcp_inch'] = prcp

            temp_prcp_list.append(month_dict)
     
    except AttributeError:
        pass
    
    # add data to the larger dict
    city_info_dict["temp_prcp"] = temp_prcp_list
            
    top_cities_info.append(city_info_dict)
    
    time.sleep(1)
    
browser.quit()

print(json.dumps(top_cities_info, indent=2, sort_keys=False))