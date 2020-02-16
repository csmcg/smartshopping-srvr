const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

app.post('/', (req, res) => {
	console.log(res.json(req.body));
});

app.listen(port, '10.42.0.1', () => console.log(`Listening on port ${port}`));
