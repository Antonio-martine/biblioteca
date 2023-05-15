const {ServicioSocial} = require('.../conexion')

const Sequilize = require('sequelize');
const express = require("express");

const mysql = require('mysql');
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'biblioteca'
});

conexion.connect();

module.exports={conexion}