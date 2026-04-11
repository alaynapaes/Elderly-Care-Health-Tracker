CREATE DATABASE elderly_care;

USE elderly_care;

CREATE TABLE User (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(20)
);

CREATE TABLE Patient (
  patient_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  age INT,
  gender VARCHAR(10),
  room_number VARCHAR(10),
  emergency_contact VARCHAR(15)
);

ALTER TABLE Patient
ADD COLUMN user_id INT,
ADD FOREIGN KEY (user_id) REFERENCES User(user_id);

CREATE TABLE Daily_Health_Record (
  record_id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT,
  user_id INT,
  date DATE,
  blood_pressure VARCHAR(10),
  sugar_level INT,
  heart_rate INT,
  temperature FLOAT,
  oxygen_level INT,
  FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Medical_History (
  history_id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT,
  disease VARCHAR(100),
  notes TEXT,
  FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
);

CREATE TABLE Medication (
  medication_id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT,
  medicine_name VARCHAR(100),
  dosage VARCHAR(50),
  timing VARCHAR(50),
  FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
);

INSERT INTO Medical_History (patient_id, disease, notes)
VALUES (1, 'Hypertension', 'Needs regular monitoring');

INSERT INTO Medication (patient_id, medicine_name, dosage, timing)
VALUES (1, 'Amlodipine', '5mg', 'Morning');


