CREATE SCHEMA sensordb;

USE sensordb;

CREATE TABLE current_state(
    idNum int(20),
    ppmLevel float,
    dateSensed DATE,
    stats varchar(50),

    PRIMARY KEY(idNum)
);

CREATE TABLE overall_states(
    id int(20),
    ppmLevel float,
    dateSensed DATE,
    stats varchar(50),

    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES current_state(idNum)
);