const express = require("express"); 
const app = express();

const bodyParser = require("body-parser");
const mysql = require("mysql");
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');
const keys = require('./settings/keys');

const PORT = process.env.PORT || 3050;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));

//MySql
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "soccer"
});

//Route
app.get('/', (req,res)=>{
    res.send('wellcome to my API!');
});


//all customers
app.get('/team', (req,res)=>{
    const sql = 'SELECT * FROM equipos';

    con.query(sql, (err, result)=>{
      if (err) throw err;
      res.json(result);
    });
});

app.get('/player', (req,res)=>{
    const sql = 'SELECT * FROM futbolista';

    con.query(sql, (err, result)=>{
      if (err) throw err;
      res.json(result);
    });
});

app.get('/player/:team_id', (req,res)=>{
    const {team_id} = req.params;
    const sql = `SELECT * FROM futbolista WHERE team_id = ${team_id}`;
    con.query(sql, (err, result)=>{
        if (err) throw err;
            res.json(result);
    });
});

app.get('/playerPos/:position', (req,res)=>{
    const {position} = req.params;
    const sql = `SELECT * FROM futbolista WHERE position = '${position}'`;
    con.query(sql, (err, result)=>{
        if (err) throw err;
            res.json(result);
    });
});

app.post('/addTeam', (req,res)=>{
    const sql = 'INSERT INTO equipos SET ?'; 
    const equiposObj = {
        name: req.body.name,
        league: req.body.league,
        country: req.body.country
    };

    con.query(sql, equiposObj, err => {
        if (err) throw err;
        res.send('team created!');
    });
});

app.post('/addPlayer', (req,res)=>{
    const sql = 'INSERT INTO futbolista SET ?';
    const futbolistaObj = {
        name: req.body.name,
        age: req.body.age,
        team_id: req.body.team_id,
        squad_number: req.body.squad_number,
        position: req.body.position,
        nationality: req.body.nationality

    };

    con.query(sql, futbolistaObj, err => {
        if (err) throw err;
        res.send('player created!');
    });
});


app.put('/update/:team_id', (req,res)=>{
    const {team_id} = req.params;
    const {name,nationality,age} = req.body;
    const sql = `UPDATE futbolista SET name = '${name}', age='${age}', nationality='${nationality}' WHERE team_id =${team_id}`;
    const equiposObj = {
        name: req.body.name,
        age: req.body.age,
        nationality: req.body.nationality
    };
    con.query(sql, equiposObj, error => {
        if (error) throw error;
        res.send('team updated!');
    });
});

app.delete('/delete/:team_id', (req,res)=>{
    const {team_id} = req.params;
    const sql = `DELETE FROM futbolista WHERE team_id= ${team_id}`;
   
    con.query(sql, error => {
        if (error) throw error;
        res.send('team deleted!');
    });
});


// Check connect
con.connect(error=>{
    if (error) throw error;
    console.log('connected to mysql server');
});


app.set('key', keys.key);
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.post('/login', (req,res)=>{
    if(req.body.usuario == 'admin'&& req.body.pass == '12345'){
        const payload= {
            check: true
        };
        const token = jwt.sign(payload, app.get('key'),{
            expiresIn:'7d'
        });
        res.json({
            message: 'AUTHENTICACIÓN EXITOSA!',
            token: token
        });
    } else {
        res.json({
            message: 'Usuario y/o password son incorrectos'
        })
    }
});
