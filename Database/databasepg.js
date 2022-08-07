const { request } = require('express');
const {Client} = require('pg');
const socketio = require('socket.io');

const client = new Client({
    host: 'ec2-35-168-65-132.compute-1.amazonaws.com',
    user: 'ebaoaybxqeahhw',
    port: 5432, 
    password: '1e8c73168c66a648d3a747e6ea0929829330bd83bfbd8f1b77eabe0fbd75b1f1',
    database: 'deuem33rapubqd',
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
})

//leaderboard SQL query here
const leaderboard = 'SELECT username, wins FROM userinfo ORDER BY wins';


client.connect()
client.query(leaderboard, (err, res) => {
    if(!err){
        console.log(res.rows);
    }
    else {
        console.log(err.message);
    }
    client.end()
})

// on new user joining, INSERT new user into table
newUser = false;

if (newUser == true) {

    var insert = 'INSERT INTO userinfo VALUES (' + request.username + ', ' + request.password + ', 0)';

    client.query(insert, (err, res) => {
        if(!err){
            console.log(res.rows);
        }
        else {
            console.log(err.message);
        }
        client.end()
    })
}

//if sock request is received when user wins, increment wins for that user

//var select = 'SELECT wins FROM userinfo WHERE username = "' + request.username + '"';
//var statement = 'UPDATE TABLE userinfo SET wins = ' + (select + 1) + 'WHERE username = "' + sock request.username + '"';