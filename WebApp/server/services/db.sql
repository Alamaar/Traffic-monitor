CREATE DATABASE monitor;

CREATE TABLE users (
    user_id serial PRIMARY KEY,
    username VARCHAR ( 50 ) ,
    password VARCHAR ( 128 ) NOT NULL,
    email VARCHAR ( 255 ) UNIQUE NOT NULL

);
   
CREATE TABLE traffic_others (
    id serial PRIMARY KEY,
    person_west INTEGER,
    person_east INTEGER,
    bus_west INTEGER,
    bus_east INTEGER,
    truck_east INTEGER,
    truck_west INTEGER,
    bicycle_west INTEGER,
    bicycle_east  INTEGER,                   
    dog_west INTEGER, 
    dog_east INTEGER, 
    motorcycle_west INTEGER, 
    motorcycle_east INTEGER,
    time TIMESTAMP
  
);


CREATE TABLE CARS (
    id serial PRIMARY KEY,
    west INTEGER,
    east INTEGER,
    speed_west NUMERIC,
    speed_east NUMERIC,
    time TIMESTAMP
);

CREATE TABLE live (
    id serial PRIMARY KEY,
    class_name VARCHAR,
    speed NUMERIC,
    direction VARCHAR(50),
    time TIMESTAMP

);



