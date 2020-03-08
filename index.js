const express = require('express')
const app = express()
const trilat = require('node-trilateration')
const _ = require('lodash');
const netinfo = require('./netinfo.js');
import locate from 'multilateration/dist/multilateration.js';
const kalmanFilter = require('kalmanjs');
const port = netinfo.serverPort;
const serverIP = netinfo.serverIP;


const kalmanModel = {
	R:	0.0001, // process noise - very low
	Q:		1, // mesaurement noise - very high, sugg. to start with 3 and 
			  // play with. std dev is a good choice
	//A:	,
	//B:	,
	//u:	1	  // set to 1 if moving, 0 if static
};

const beacon_locs = [
	{minor:		1,
		 x:		0,
		 y:		2.7,
	distance:	null},
	{minor:	2,
		x: 1.65,
		y: 3.93,
		distance: null},
	{minor: 3,
		x: 0,
		y: 5.7,
		distance: null},
	{minor: 4,
		x: 1.65,
		y: 7.2,
		distance: null},
	{minor: 5,
		x: 4.2,
		y: 8.5,
		distance: null},
	{minor: 6,
		x: 4.8,
		y: 7.5,
		distance: null},
	{minor: 7,
		x: 3.3,
		y: 5.7,
		distance: null},
	{minor: 8,
		x:	4.8,
		y:  3.6,
		distance: null},
	{minor: 9,
		x: 3.3,
		y: 2.4,
		distance: null},
	{minor: 10,
		x:	3.15,
		y:	0,
		distance: null}
];

let filters = [];
for (let i = 0; i < 10; i++) {
	filters.push(new kalmanFilter(kalmanModel));
}

// path loss vals from run1
const n = 1.831;
const power_at_1 = 59;
// room dims
const max_x = 5.0;
const max_y = 8.5;

const getDistance = (rssi, minor) => {
	var d = (10 ** ((rssi + power_at_1) / (n * -10)));
	//d = filters[minor - 1].filter(d);
	return d;

}

const getLoc = (sample) => {
	sample = _.sortBy(sample, ['rssi']).splice(sample.length - 7, 7);; // get 3 strongest signals
	let beacons = [];
	sample.forEach((b) => {
		let reference = beacon_locs[b['minor'] - 1];
		//console.log(reference);
		let toMultilat = { x:			reference['x'], 
						 y:			reference['y'], 
						 distance:	getDistance(b['rssi'], b['minor'])};
		beacons.push(toMultilat);
	});
	//console.log(beacons);
	let loc = locate(beacons);
	console.log(`(${_.round(loc.x, 2)}, ${_.round(loc.y, 2)})`);
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
