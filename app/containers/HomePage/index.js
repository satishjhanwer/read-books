import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Input, Form, FormGroup, Label, Button } from 'reactstrap';
import { changeSearchTerm, requestBookSearchFailure, requestBookSearchSuccess } from './slice';
import messages from './messages';
import { requestBookSearch } from './flow';

// const getRatingStars = (rating) => {
//   const rawRating = Math.round(rating);
//   const stars = [];
//   for (let i = 0; i < rawRating; i += 1) {
//     stars.push(<span key={i} className="fa fa-star" />);
//   }
//   return stars;
// };

const getBookISBN = (str) => str.replace('/works/', '');

export function HomePage() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const { bookList, errorMessage } = useSelector(
    ({ home: { bookList = [], errorMessage = undefined } = {} }) => ({
      bookList,
      errorMessage,
    }),
    shallowEqual,
  );

  const onChangeSearchTerm = (evt) => {
    setSearchQuery(evt.target.value);
    dispatch(changeSearchTerm(evt.target.value));
  };

  const onSubmitForm = async (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    try {
      const { data = [] } = await requestBookSearch(searchQuery);
      dispatch(requestBookSearchSuccess(data));
    } catch (error) {
      dispatch(requestBookSearchFailure(error));
    }
  };

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A React.js application for searching books" />
      </Helmet>
      <br />
      <Row>
        <Col sm={{ size: 7, offset: 2 }}>
          <Form name="loginForm" onSubmit={onSubmitForm}>
            <FormGroup row>
              <Label for="searchBook" sm={2}>
                <FormattedMessage {...messages.inputText} />
              </Label>
              <Col sm={10}>
                <Input
                  placeholder="Search here for book name"
                  id="searchBook"
                  type="search"
                  value={searchQuery}
                  onChange={onChangeSearchTerm}
                  required
                />
              </Col>
            </FormGroup>
            <FormGroup check row>
              <Col sm={{ size: 4, offset: 2 }}>
                <Button color="primary" className="btn-block" type="submit">
                  <FormattedMessage {...messages.searchBtn} />
                </Button>
              </Col>
            </FormGroup>
          </Form>
          <div className="login-err">
            <p>{errorMessage}</p>
          </div>
        </Col>
      </Row>
      <br />
      <Row>
        {bookList && bookList.length > 0 ? (
          bookList.map((book) => (
            <Col className="book-list" sm="4" key={book.bookId}>
              <div className="thumbnail">
                <img src={book.covers} alt="" className="img-responsive" />
                <div className="space-ten" />
                <div className="caption">
                  <h6>{book.title}</h6>
                </div>
                <div className="space-ten" />
                <div className="ratings">
                  <p>
                    {book.editions}
                    <FormattedMessage {...messages.reviews} />
                    {book.languageCount}
                    <FormattedMessage {...messages.language} />
                  </p>
                </div>
                <div className="space-ten" />
                <div className="btn-ground text-center">
                  <Link to={`/book/${getBookISBN(book.bookId)}`} key={book.bookId}>
                    <i className="fa fa-search" /> <FormattedMessage {...messages.quickView} />
                  </Link>
                </div>
                <div className="space-ten" />
              </div>
            </Col>
          ))
        ) : (
          <></>
        )}
      </Row>
    </>
  );
}

HomePage.propTypes = {
  bookList: PropTypes.any,
  onSubmitForm: PropTypes.func,
  searchTerm: PropTypes.string,
  errorMessage: PropTypes.string,
  onChangeSearchTerm: PropTypes.func,
};

export default HomePage;
