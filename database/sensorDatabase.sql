CREATE SCHEMA sensordb;

USE sensordb;

CREATE TABLE current_state(
    idNum int(20) NOT NULL AUTO_INCREMENT,
    currentLevel int NOT NULL,
    ppmVal int NOT NULL,
    dateSensed DATE NOT NULL UNIQUE,
    levels int NOT NULL,

    PRIMARY KEY(idNum)
);