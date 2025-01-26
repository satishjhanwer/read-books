const express = require('express');
const rp = require('axios');

const BASE_URL = process.env.GOOD_READ_ENDPOINT || 'https://openlibrary.org/';

const goodReadRouter = express.Router();

// export const getCoverImage = (coverId) => `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;

goodReadRouter.route('/search').get((req, res) => {
  const { query } = req;
  rp.get(`${BASE_URL}/search.json`, { params: { ...query } })
    .then(({ data: { docs = [] } = {} }) => {
      return res.status(200).json(docs);
    })
    .catch(() => {
      res.status(500).send('Something got broke, We are working on it.');
    });
});

goodReadRouter.route('/book/works/:id').get((req, res) => {
  const {
    params: { id },
  } = req;
  rp.get(`${BASE_URL}/works/${id}.json`)
    .then(({ data = {} }) => {
      return res.status(200).json(data);
    })
    .catch(() => {
      res.status(500).send('Something got broke, We are working on it.');
    });
});

goodReadRouter.route('/author/:id').get((req, res) => {
  const {
    params: { id },
  } = req;

  rp.get(`${BASE_URL}/author/${id}.json`)
    .then(({ data = {} }) => {
      return res.status(200).json(data);
    })
    .catch(() => {
      res.status(500).send('Something got broke, We are working on it.');
    });
});
module.exports = goodReadRouter;
