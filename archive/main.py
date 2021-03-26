from bs4 import BeautifulSoup

soup = BeautifulSoup(open("messages/messages0.html"), "html.parser")

for attch_desc in soup.find_all('div', attrs={'class': 'attachment__description'}):
  if (str(attch_desc.string) == "Фотография"):
    print(attch_desc.find_next_sibling().string)
