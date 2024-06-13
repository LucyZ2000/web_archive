import requests
from bs4 import BeautifulSoup
import subprocess

def get_hyperlinks(file_path):
    with open(file_path, "r") as file:
        html = file.read()

    soup = BeautifulSoup(html, "html.parser")

    a_tags = soup.find_all('a')

    links = []
    for a in a_tags:
        if a.get('href') != None and a.get('href')[0] == "h":
            links.append(a.get('href'))


    # links = [a.get('href') for a in a_tags if a.get('href')]
    return links

def download_website(url):
    command = (
        f"wget --recursive --no-clobber --page-requisites --html-extension "
        f"--convert-links --restrict-file-names=windows --domains https://web.archive.org/web/20180315005749 --no-parent {url}"
    )
    try:
        # Run the wget command
        result = subprocess.run(command, shell=True, capture_output=True, text=True, check=True)
        print(f"Downloaded {url} successfully")
    except subprocess.CalledProcessError as e:
        print(f"Failed to download {url}")
        print("Error:")
        print(e.stderr)

# Example usage


def main():
    links = get_hyperlinks("index.html")
    print(links)
    for link in links:
        download_website(link)

if __name__ == "__main__":
    main()

