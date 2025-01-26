/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Row, Col, Input, Form, FormGroup, Label, Button } from 'reactstrap';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectBookList, makeSelectSearchTerm, makeSelectErrorMessage } from './selectors';

import { changeSearchTerm, requestBookSearch } from './actions';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

const key = 'home';

const getRatingStars = (rating) => {
  const rawRating = Math.round(rating);
  const stars = [];
  for (let i = 0; i < rawRating; i += 1) {
    stars.push(<span key={i} className="fa fa-star" />);
  }
  return stars;
};

export function HomePage({ bookList, onSubmitForm, searchTerm, onChangeSearchTerm, errorMessage }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    // When initial state searchTerm is not null, submit the form to load books
    if (searchTerm && searchTerm.trim().length > 0) onSubmitForm();
  }, []);

  return (
    <React.Fragment>
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
                  value={searchTerm}
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
                    {getRatingStars(book.ratings)}({book.reviewCount} <FormattedMessage {...messages.reviews} />
                  </p>
                </div>
                <div className="space-ten" />
                <div className="btn-ground text-center">
                  <Link to={`/book/${book.bookId}`} key={book.bookId}>
                    <i className="fa fa-search" /> <FormattedMessage {...messages.quickView} />
                  </Link>
                </div>
                <div className="space-ten" />
              </div>
            </Col>
          ))
        ) : (
          <React.Fragment />
        )}
      </Row>
    </React.Fragment>
  );
}

HomePage.propTypes = {
  bookList: PropTypes.any,
  searchTerm: PropTypes.string,
  errorMessage: PropTypes.string,
  onChangeSearchTerm: PropTypes.func,
  onSubmitForm: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  searchTerm: makeSelectSearchTerm(),
  errorMessage: makeSelectErrorMessage(),
  bookList: makeSelectBookList(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeSearchTerm: (evt) => dispatch(changeSearchTerm(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(requestBookSearch());
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(HomePage);
