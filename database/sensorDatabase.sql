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

CREATE TABLE overall_states(
    id int(20) NOT NULL,
    lastPPM float NOT NULL,
    dateeSensed DATE NOT NULL UNIQUE,
    levelss int NOT NULL,
    stats varchar(50),

    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES current_state(idNum)
);

CREATE EVENT dataTransfer
ON SCHEDULE 
EVERY 1 DAY
DO
INSERT INTO overall_states (id, lastPPM, dateSensed, levels)
SELECT id, ppmVal, dateeSensed, levelss
FROM current_state
WHERE dateSensed = DATE_FORMAT(dateSensed, '%d') = DATE_FORMAT(DATEADD(day, -1, CAST(GETDATE() AS date)), '%d');
