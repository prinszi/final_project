# Overview

Analysis of restaurants in Chicago based on their health code violations in 2019, broken up by category. Used Random Forest and Classification models to predict which restaurants would fail a health inspection.

Data was pulled from the Google API to get restaurant reviews (stars) and from Chicago's Data Portal to get the inspection data.

The final result was a web page (built with Flask) and an interactive map (built with Leaflet) with data for each restaurant, including number of violations, stars, and our models' predictions. The web page included a word cloud of the most frequently used terms in the violations and a graph of relating the number of violations to the number of stars received.

Final Project for Stephanie Burr, Evan Stroh, and Prinssi Schultz

## Instructions

1. Clone the repository to a local directory.
2. Navigate to the directory and in the command line enter, "flask run". This creates the SQLite file that our webpage queries to show the data.
3. Open a new browser tab and open the "Marker_Cluster.html" file.
