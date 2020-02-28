const express = require('express')
const app = express()
const port = 3000
const trilat = require('node-trilateration')
const _ = require('lodash');

const beacon_locs = [
	{minor:		1,
		 x:		4,
		 y:		0,
	distance:	null},
	{minor:	2,
		x: 3.22,
		y: 2.1,
		distance: null},
	{minor: 3,
		x: 4.78,
		y: 3.45,
		distance: null},
	{minor: 4,
		x: 3.22,
		y: 4.8,
		distance: null},
	{minor: 5,
		x: 4.78,
		y: 6.15,
		distance: null},
	{minor: 6,
		x: 4,
		y: 7.7,
		distance: null}
];

// path loss vals from run1
const n = 2;
const power_at_1 = 65;

const getDistance = (rssi) => {
	return (10 ** ((rssi + power_at_1) / (n * -10)));
}

const getLoc = (sample) => {
	sample = _.sortBy(sample, ['rssi']).splice(sample.length - 3, 3);; // get 3 strongest signals
	let beacons = [];
	sample.forEach((b) => {
		let reference = beacon_locs[b['minor'] - 1];
		//console.log(reference);
		let toTrilat = { x:			reference['x'], 
						 y:			reference['y'], 
						 distance:	getDistance(b['rssi'])};
		beacons.push(toTrilat);
	});
	//console.log(beacons);
	let loc = trilat.calculate(beacons);
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

app.listen(port, '10.42.0.1', () => console.log(`Listening on port ${port}`));
