import os
from bs4 import BeautifulSoup
import pymongo

DIRECTORY = "messages/"

for filename in os.listdir(DIRECTORY):
  if filename.endswith(".html"):
    soup = BeautifulSoup(open(DIRECTORY+filename), "html.parser")

    for attch_desc in soup.find_all('div', attrs={'class': 'attachment__description'}):
      if (str(attch_desc.string) == "Фотография"):
        image = str(attch_desc.find_next_sibling().string)
        head = attch_desc.find_next_sibling().parent.parent.parent.find_previous_sibling()
        name = str(head.a and head.a.string or "Толя Копыл")
        date = str(head.text).split(", ")[1].replace(" (ред.)", "")
        
