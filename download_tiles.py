import math
import os
import requests
from PIL import Image

url_template = "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.leichte-basiskarte_reliefschattierung/default/current/3857/{z}/{x}/{y}.png"

min_zoom = 1  # Set your desired minimum zoom level
max_zoom = 2  # Set your desired maximum zoom level
x_range = (1, 3)  # Set the x range (inclusive, exclusive)
y_range = (1, 3)  # Set the y range (inclusive, exclusive)


def lat_lng_to_tile_coords(lat, lng, zoom):
    lat_rad = math.radians(lat)
    n = 2.0 ** zoom
    x = int((lng + 180.0) / 360.0 * n)
    y = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
    return x, y


def bounding_box_to_tile_range(min_lat, min_lng, max_lat, max_lng, zoom):
    min_x, max_y = lat_lng_to_tile_coords(min_lat, min_lng, zoom)
    max_x, min_y = lat_lng_to_tile_coords(max_lat, max_lng, zoom)
    return (min_x, max_x + 1), (min_y, max_y + 1)


min_lat, min_lng = 45.8180, 5.9546  # Lower-left corner
max_lat, max_lng = 47.8084, 10.4921  # Upper-right corner
zoom = 8
x_range, y_range = bounding_box_to_tile_range(
    min_lat, min_lng, max_lat, max_lng, zoom)

print(f"x_range: {x_range}, y_range: {y_range}")

os.makedirs("tiles", exist_ok=True)

for zoom in range(min_zoom, max_zoom + 1):
    for x in range(*x_range):
        for y in range(*y_range):
            url = url_template.format(z=zoom, x=x, y=y)
            response = requests.get(url)
            print(response.status_code)
            if response.status_code == 200:
                tile_path = f"tiles/{zoom}_{x}_{y}.png"
                with open(tile_path, "wb") as f:
                    f.write(response.content)

tiles = [Image.open(f"tiles/{zoom}_{x}_{y}.png")
         for x in range(*x_range) for y in range(*y_range)]
combined_image = Image.new(
    "RGBA", (tiles[0].width * (x_range[1] - x_range[0]), tiles[0].height * (
        y_range[1] - y_range[0])))

for i, tile in enumerate(tiles):
    x = i % (x_range[1] - x_range[0]) * tile.width
    y = i // (x_range[1] - x_range[0]) * tile.height
    combined_image.paste(tile, (x, y))

combined_image.save("combined_image.png")
