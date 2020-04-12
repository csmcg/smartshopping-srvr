const express = require('express')
const app = express()
const trilat = require('node-trilateration')
const _ = require('lodash');
const netinfo = require('./netinfo.js');
import locate from 'multilateration/dist/multilateration.js';
const kalmanFilter = require('kalmanjs');
const port = netinfo.serverPort;
const serverIP = netinfo.serverIP;

const getLoc = (sample) => {
}	

app.use(express.json());

app.post('/', (req, res) => {
	console.log('received');
	//console.log(req.body);
	//console.log(JSON.stringify(req.body));
	getLoc(req.body);
	res.send("ok");
});

app.listen(port, serverIP, () => console.log(`Listening on port ${port}`));
