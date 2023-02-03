const express = require('express');
const rp = require('request-promise');
const xml2js = require('xml2js');

const baseOptions = {
  baseUrl: process.env.GOOD_READ_ENDPOINT || 'https://openlibrary.org/',
};
const goodReadRouter = express.Router();

// const extractsGoodReadResponse = (goodReadsResult) => {
//   const {
//     GoodreadsResponse: {
//       search: [
//         {
//           results: [response],
//         },
//       ],
//     },
//   } = goodReadsResult;

//   return response.work;
// };

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

const getCoverImage = (coverId) => `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;

const extractBookResponse = (results) => {
  const output = [];
  const { docs } = results;
  docs.forEach((bookObj) => {
    const { cover_i: coverId, key, title, edition_count: editions, language } = bookObj;
    if (coverId !== undefined) {
      output.push({
        bookId: key,
        title,
        covers: getCoverImage(coverId),
        editions,
        languageCount: language ? language.length : 0,
      });
    }
  });
  return { docs: output };
};

const extractAuthorResponse = (goodReadsResult) => {
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

  const books = bookList.map((book) => convertListToObject(BOOK_EXCLUDE_LIST, book));
  return { ...author, books };
};

goodReadRouter.route('/search').get((req, res) => {
  const { query } = req;
  const options = { ...baseOptions, url: '/search.json' };
  options.qs = { ...options.qs, ...query };
  rp(options)
    .then((result) => {
      const output = extractBookResponse(JSON.parse(result));
      return res.status(200).json(output);
    })
    .catch(() => res.status(500).send('Something got broke, We are working on it.'));
});

goodReadRouter.route('/book/works/:id').get((req, res) => {
  const {
    params: { id },
  } = req;
  const options = { ...baseOptions, url: `/works/${id}.json` };
  rp(options)
    .then((result) => {
      console.log('result------>', result);
      return res.status(200).json(JSON.parse(result));
    })
    .catch((err) => {
      console.error('err---------->', err);
      return res.status(500).send('Something got broke, We are working on it.');
    });
});

goodReadRouter.route('/author/:id').get((req, res) => {
  const {
    params: { id },
  } = req;
  const options = { ...baseOptions, url: '/author/show.xml' };
  options.qs = { ...options.qs, id };
  rp(options).then((result) => {
    xml2js.parseString(result, (er, goodReadsResult) => {
      if (er) {
        return res.status(500).send('Something got broke, We are working on it.');
      }
      return res.status(200).json(extractAuthorResponse(goodReadsResult));
    });
  });
});
module.exports = goodReadRouter;
