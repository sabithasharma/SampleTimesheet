-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2017 at 03:16 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--
/*CREATE DATABASE test;*/
CREATE TABLE IF NOT EXISTS test.user (
  userId INT NOT NULL,
  username VARCHAR(30) NOT NULL,
  password VARCHAR(30) NOT NULL,
  managerEmail VARCHAR(30) NOT NULL,
  projects VARCHAR(500) NOT NULL,
  PRIMARY KEY (userId),
  UNIQUE (userId),
  designation VARCHAR (30) NOT NULL,
  email VARCHAR (50) NOT NULL
);

INSERT INTO test.user (userId, username, password, managerEmail, projects, designation, email) 
VALUES (111,"sabitha", "123", "sabithadummy@gmail.com", "P1,P2", "Software Engineer", "sabitha.sharma@gmail.com");

INSERT INTO test.user (userId, username, password, managerEmail, projects, designation, email) 
VALUES (222,"vishal", "456", "sabithadummy@gmail.com", "P1,P2" , "Database Administrator", "vishalsharma.co@gmail.com");

CREATE TABLE IF NOT EXISTS test.sabitha111 ( 
  userId VARCHAR(500) NOT NULL, 
  dates VARCHAR(500) NOT NULL UNIQUE, 
  normal INT,
  overtime1 INT,
  overtime2 INT,
  vacationLeave INT,
  sickLeave INT,
  childCareLeave INT,
  project VARCHAR(500),
  dateNumber VARCHAR (50) UNIQUE,
  month VARCHAR (50),
  year VARCHAR (50)
   );

INSERT INTO test.sabitha111 (userId, dates, normal, overtime1, overtime2, vacationLeave, sickLeave, childCareLeave, project, dateNumber, month, year) VALUES (111,'15/1/2018', 8, 8, 8, 8, 8, 8, 'P1' , 15 ,1, '2018');
INSERT INTO test.sabitha111 (userId, dates, normal, overtime1, overtime2, vacationLeave, sickLeave, childCareLeave, project, dateNumber, month, year) VALUES (111,'16/1/2018', 8, 8, 8, 8, 8, 8, 'P1', 16, 1, '2018');
INSERT INTO test.sabitha111 (userId, dates, normal,  overtime1, overtime2, vacationLeave, sickLeave, childCareLeave, project, dateNumber, month, year) VALUES (111,'17/1/2018', 8,  8, 8, 8, 8, 8, 'P1', 17, 1, '2018');

/*
updating timesheet
UPDATE timesheet SET dates = "16/1/2018" WHERE userid = 1 AND dates = '22/1/2018' 
UPDATE timesheet SET dateValue = "99" WHERE userid = 1 AND dates = '16/1/2018'*/

/* Accessing dates Value
  SELECT * FROM `timesheet` WHERE userId = "1" AND dates = "16/01/2018" 
*/

/* Updating projects
UPDATE test.user SET projects = '["projects1","projects2"]' WHERE userid = 111
*/
