CREATE SCHEMA sensordb;

USE sensordb;

CREATE TABLE current_state(
    idNum int(20) NOT NULL AUTO_INCREMENT,
    ppmVal int NOT NULL,
    dateSensed DATE NOT NULL,
    levels int NOT NULL,
    stats varchar(50),

    PRIMARY KEY(idNum)
);

CREATE TABLE overall_states(
    id int(20) NOT NULL,
    avgPPM float NOT NULL,
    dateSensed DATE NOT NULL,
    levels int NOT NULL,
    stats varchar(50),

    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES current_state(idNum)
);

ALTER TABLE current_state ALTER dateSensed SET DEFAULT NOW();
INSERT INTO current_state (levels) VALUES (8);