const express = require('express')
const app = express()

// DBMS Mysql 
const mysql = require('mysql2');
// Cross Origin Resourse Sharing 
//const cors = require('cors');
// Environment variable doc 
const dotenv = require('dotenv'); 

// 
app.use(express.json());
//app.use(cors());
dotenv.config(); 

// connection to the database 
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME 
// });

// Check if there is a connection 
//db.connect((err) => {
    // If no connection 
    //if(err) return console.log("Error connecting to MYSQL");

    //If connect works successfully
    //console.log("Connected to MYSQL as id: ", db.threadId); 
//}) 

// Create a MySQL connection pool using the .env variables
const pool = mysql.createPool({
  host:process.env.DB_HOST,
  user:process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME,   

  connectionLimit: 20, // Adjust as needed
});

//  Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database MySQL database successfully!');
  connection.release();
});

// Question 1,2: Create endpoints to retrieve patients and providers
app.get('/patients', (req, res) => {
  pool.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
    if (err) {
      console.error('Error retrieving patients:', err);
      res.status(500).json({ error: 'Failed to retrieve patients' });
    } else {
      res.json(results);
    }
  });
});

app.get('/providers', (req, res) => {
  pool.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
    if (err) {
      console.error('Error retrieving providers:', err);
      res.status(500).json({ error: 'Failed to retrieve providers' });
    } else {
      res.json(results);
    }
  });
});

// Question 3,4: Create endpoints to filter patients and providers
app.get('/patients/:firstName', (req, res) => {
  const firstName = req.params.firstName;
  pool.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [firstName], (err, results) => {
    if (err) {
      console.error('Error filtering patients:', err);
      res.status(500).json({ error: 'Failed to filter patients' });
    } else {
      res.json(results);
    }
  });
});

app.get('/providers/:specialty', (req, res) => {
  const specialty = req.params.specialty;
  pool.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
    if (err) {
      console.error('Error filtering providers:', err);
      res.status(500).json({ error: 'Failed to filter providers' });
    } else {
      res.json(results);
    }
  });
});


// listen to the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`)
})