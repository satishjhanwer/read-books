const express = require('express');
const rp = require('request-promise');
const xml2js = require('xml2js');

const baseOptions = {
  baseUrl: process.env.GOOD_READ_ENDPOINT || 'https://www.goodreads.com',
  qs: {
    key: process.env.GOOD_READ_KEY || 'zmD2sLp5KUJtEfr5ACBRCA',
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

const BOOK_EXCLUDE_LIST = [
  'work',
  'popular_shelves',
  'book_links',
  'buy_links',
  'series_works',
  'similar_books',
  'reviews_widget',
  'authors',
];

const convertListToObject = (EXCLUDE_LIST, resObj) =>
  Object.keys(resObj).reduce((output, key) => {
    const res = {};
    let [val] = resObj[key];
    val = typeof val === 'object' ? val._ : val;
    if (EXCLUDE_LIST) {
      if (!EXCLUDE_LIST.includes(key)) {
        res[key] = val;
      }
    } else {
      res[key] = val;
    }
    return { ...output, ...res };
  }, {});

const extractBookResponse = goodReadsResult => {
  const {
    GoodreadsResponse: {
      book: [book],
    },
  } = goodReadsResult;

  const bookDetails = convertListToObject(BOOK_EXCLUDE_LIST, book);

  const [
    {
      author: [author],
    },
  ] = book.authors;

  const authorInfo = convertListToObject([], author);
  return { ...bookDetails, author: authorInfo };
};

const extractAuthorResponse = goodReadsResult => {
  const EXCLUDE_LIST = ['books'];
  const {
    GoodreadsResponse: {
      author: [authorObj],
    },
  } = goodReadsResult;

  const author = convertListToObject(EXCLUDE_LIST, authorObj);

  const {
    books: [{ book: bookList }],
  } = authorObj;

  const books = bookList.map(book =>
    convertListToObject(BOOK_EXCLUDE_LIST, book),
  );
  return { ...author, books };
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
        authorName: work.best_book[0].author[0].name[0],
        authorId: work.best_book[0].author[0].id[0]._,
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

goodReadRouter.route('/author/:id').get((req, res) => {
  const {
    params: { id },
  } = req;
  const options = { ...baseOptions, url: '/author/show.xml' };
  options.qs = { ...options.qs, id };
  rp(options).then(result => {
    xml2js.parseString(result, (er, goodReadsResult) => {
      if (er) {
        return res
          .status(500)
          .send('Something got broke, We are working on it.');
      }
      return res.status(200).json(extractAuthorResponse(goodReadsResult));
    });
  });
});
module.exports = goodReadRouter;
