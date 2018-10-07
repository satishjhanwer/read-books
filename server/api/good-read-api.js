const express = require('express');
const rp = require('request-promise');
const xml2js = require('xml2js');

const baseOptions = {
  baseUrl: process.env.GOOD_READ_ENDPOINT || 'https://www.goodreads.com',
  qs: {
    key: process.env.GOOD_READ_KEY || '',
  },
};
const goodReadRouter = express.Router();

const extractsGoodReadResponse = goodReadsResult => {
  const {
    GoodreadsResponse: {
      search: [
        {
          results: [response],
        },
      ],
    },
  } = goodReadsResult;

  return response.work;
};

const extractBookResponse = goodReadsResult => {
  const EXCLUDE_LIST = [
    'work',
    'popular_shelves',
    'book_links',
    'buy_links',
    'series_works',
    'similar_books',
    'reviews_widget',
    'authors',
  ];

  const {
    GoodreadsResponse: {
      book: [book],
    },
  } = goodReadsResult;

  const bookDetails = Object.keys(book).reduce((output, key) => {
    const res = {};
    if (!EXCLUDE_LIST.includes(key)) {
      const [val] = book[key];
      res[key] = val;
    }
    return { ...output, ...res };
  }, {});

  const [
    {
      author: [author],
    },
  ] = book.authors;

  const authorInfo = Object.keys(author).reduce((output, key) => {
    const res = {};
    const [val] = author[key];
    res[key] = val;
    return { ...output, ...res };
  }, {});
  return { ...bookDetails, author: authorInfo };
};

goodReadRouter.route('/search').get((req, res) => {
  const { query } = req;
  const options = { ...baseOptions, url: '/search/index.xml' };
  options.qs = { ...options.qs, ...query };
  rp(options).then(result => {
    xml2js.parseString(result, (er, goodReadsResult) => {
      if (er) {
        return res
          .status(500)
          .send('Something got broke, We are working on it.');
      }
      const books = extractsGoodReadResponse(goodReadsResult).map(work => ({
        bookId: work.best_book[0].id[0]._,
        title: work.best_book[0].title[0],
        authors: work.best_book[0].author[0].name[0],
        covers: work.best_book[0].image_url[0],
        ratings: work.average_rating[0],
        ratingsCount: work.ratings_count[0]._,
        reviewCount: work.text_reviews_count[0]._,
      }));
      return res.status(200).json({ books });
    });
  });
});

goodReadRouter.route('/book/:id').get((req, res) => {
  const {
    params: { id },
  } = req;
  const options = { ...baseOptions, url: '/book/show.xml' };
  options.qs = { ...options.qs, id };
  rp(options).then(result => {
    xml2js.parseString(result, (er, goodReadsResult) => {
      if (er) {
        return res
          .status(500)
          .send('Something got broke, We are working on it.');
      }
      return res.status(200).json(extractBookResponse(goodReadsResult));
    });
  });
});

module.exports = goodReadRouter;
