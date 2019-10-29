import numpy as np
import pandas as pd
import sqlite3
from sqlite3 import Error
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
from flask import Flask, jsonify, render_template
from flask_cors import CORS

#################
# Flask Setup
#################
app = Flask(__name__)
CORS(app)

def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by the db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)
 
    return conn


@app.route("/")
def jsondata():
        
    # path where you want the db and what it's named
    database = "chi_restaurant_data.sqlite"

    # calls to functions to create the dataframes
    google_reviews_df = pd.read_csv("google_reviews.csv")
    chi_inspections_df = pd.read_csv("model_results_slim.csv")

    # create a database connection
    conn = create_connection(database)

    # create db tables
    with conn:

        cur = conn.cursor()


        drop_inspections_table = "DROP TABLE IF EXISTS inspections"
        cur.execute(drop_inspections_table)

        drop_reviews_table = "DROP TABLE IF EXISTS reviews"
        cur.execute(drop_reviews_table)

        # need to make the columns of the sql tables match the dataframe columns - data type and order
        inspections_table = """CREATE TABLE IF NOT EXISTS inspections (
                                    id integer PRIMARY KEY,
                                    inspection_id integer,
                                    license_ integer,
                                    violation_count integer,
                                    Management integer,
                                    Hygienic_Practices integer,
                                    Food_Preparation integer,
                                    Pests_Rodents integer,
                                    Utensils_Equipment integer,
                                    Physical_Facilities integer,
                                    Compliance integer,
                                    inspection_type text,
                                    risk text,
                                    results text,
                                    aka_name text,
                                    latitude real,
                                    longitude real,
                                    logistic_model_prediction integer,
                                    random_forest_prediction integer
                                );"""

        cur.execute(inspections_table)

        google_table = """CREATE TABLE IF NOT EXISTS reviews (
                                    id integer PRIMARY KEY,
                                    Average_of_Ratings real,
                                    Average_Number_of_Reviews real,
                                    Total_Number_of_Reviews real,
                                    Total_Returned real,
                                    Data_license integer,
                                    FOREIGN KEY (Data_license) REFERENCES inspections (license_)
                                ); """

        cur.execute(google_table)

        engine = create_engine("sqlite:///chi_restaurant_data.sqlite", echo=False)

        # populate the sql tables with the df data
        google_reviews_df.to_sql('reviews', con=engine, if_exists='append', index=False)
        chi_inspections_df.to_sql('inspections', con=engine, if_exists='append', index=False)

        # reflect an existing database into a new model
        Base = automap_base()

        # reflect the tables
        Base.prepare(engine, reflect=True)

        inspector = inspect(engine)

        # Save reference to the table
        Reviews = Base.classes.reviews
        Inspections = Base.classes.inspections

        # merge tables
        inner_join = """select aka_name, latitude, longitude, license_,
                    reviews.Average_of_Ratings, reviews.Data_license, avg_violations, times_inspected, binary_results,model_prediction,logistic_model_prediction
                    from inspections
                    join reviews on Data_license = license_;
                    """

        joined_results = cur.execute(inner_join)
        
        print(inspector.get_table_names())
        print(Base.classes.keys())

        # Format the data to send as json
        data = {
            "results":[]
        }

        for row in joined_results:
            data["results"].append(row)

        return jsonify(data)


#################################################
# Flask Routes
#################################################

# @app.route("/")
# def welcome():
#     session = Session(engine)

#     # Query all 
#     session = Session(engine)
#     results = session.query(Reviews).all()
#         # results2 = session.query(inspections.name, inspections.license_number).all()

#     # example on what you can do with queries. There's also .filter
#     # """
#     # session.query(Invoices.BillingPostalCode, func.sum(Items.UnitPrice * Items.Quantity)).\
#     # filter(Invoices.InvoiceId == Items.InvoiceId).\
#     # filter(Invoices.BillingCountry == 'USA').\
#     # group_by(Invoices.BillingPostalCode).\
#     # order_by(func.sum(Items.UnitPrice * Items.Quantity).desc()).all()
#     # """

#     session.close()
#     all_names = list(np.ravel(results))
#     # Convert list of tuples into normal list
#     # all_names = list(np.ravel(results))

#     print(results)
#     return (all_names)


if __name__ == '__main__':
    app.run(debug=True)