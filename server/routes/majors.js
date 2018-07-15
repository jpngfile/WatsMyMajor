const MajorsRouter = require('express').Router();
const scraper = require('../models/scrapers/majors');
const majors = require('../models/database/majors');

// Set major requirements
MajorsRouter.post('/set/:name', async function(req, res) {
  const name = req.params.name;
  const url = req.body.url;
  const data = req.body.data;
  if (!name || !url || !data) {
    res.status(400).send('Missing fields');
    return;
  }
  const err = await majors.setMajorRequirements(name, url, data);
  if (err) {
    console.log(err);
    res.status(404).send(err.message);
  } else res.send(`${name} updated successfully`);
});

// Get major requirements
MajorsRouter.get('/get/:name', async function(req, res) {
  const name = req.params.name;
  if (!name) {
    res.status(400).send('Invalid name');
    return;
  }
  const { err, data } = await majors.getMajorRequirements(name);
  if (err) {
    console.log(err);
    res.status(404).send(err.message);
  } else res.json(data);
});

// Scrape requisites from website
MajorsRouter.post('/scrape', async function(req, res) {
	const url = req.body.url;
	if (!url) {
		res.send('URL required.');
		return;
	}

	const result = await scraper.parseMajor(req.body.url);
	res.send(result);
});

module.exports = MajorsRouter;
