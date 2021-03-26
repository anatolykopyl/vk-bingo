import os
from bs4 import BeautifulSoup
from pymongo import MongoClient
from decouple import config

DIRECTORY = "messages/"
HOST_NAME = config('HOST_NAME')
HOST_URL = config('HOST_URL')

client = MongoClient(host="localhost", port=27017)
db = client.vk_bingo

for filename in os.listdir(DIRECTORY):
  if filename.endswith(".html"):
    soup = BeautifulSoup(open(DIRECTORY+filename), "html.parser")

    for attch_desc in soup.find_all('div', attrs={'class': 'attachment__description'}):
      if (str(attch_desc.string) == "Фотография"):
        image = str(attch_desc.find_next_sibling().string)
        head = attch_desc.find_next_sibling().parent.parent.parent.find_previous_sibling()
        name = str(head.a and head.a.string or HOST_NAME)
        date = str(head.text).split(", ")[1].replace(" (ред.)", "")
        link = str(head.a and head.a['href'] or HOST_URL)
        
        card = {
          "image": image,
          "name": name,
          "link": link,
          "date": date
        }

        db.cards.insert_one(card)
        
