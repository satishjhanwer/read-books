/**
 *
 * Home
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Row, Col, Input, Form, FormGroup, Label, Button } from 'reactstrap';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  makeSelectHome,
  makeSelectBookList,
  makeSelectSearchTerm,
  makeSelectErrorMessage,
} from './selectors';
import { changeSearchTerm, requestBookSearch } from './actions';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

const getRatingStars = rating => {
  const rawRating = Math.round(rating);
  const stars = [];
  for (let i = 0; i < rawRating; i += 1) {
    stars.push(<span key={i} className="fa fa-star" />);
  }
  return stars;
};
/* eslint-disable react/prefer-stateless-function */
export class Home extends React.Component {
  render() {
    const {
      bookList,
      onSubmitForm,
      searchTerm,
      onChangeSearchTerm,
      errorMessage,
      intl: { formatMessage },
    } = this.props;
    return (
      <React.Fragment>
        <br />
        <Row>
          <Col sm={{ size: 7, offset: 2 }}>
            <Form name="loginForm" onSubmit={onSubmitForm}>
              <FormGroup row>
                <Label for="searchBook" sm={2}>
                  {formatMessage(messages.inputText)}
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
                    {formatMessage(messages.searchBtn)}
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
            bookList.map(book => (
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
                      {getRatingStars(book.ratings)}({book.reviewCount}{' '}
                      {formatMessage(messages.reviews)})
                    </p>
                  </div>
                  <div className="space-ten" />
                  <div className="btn-ground text-center">
                    <Link to={`/book/${book.bookId}`} key={book.bookId}>
                      <i className="fa fa-search" />{' '}
                      {formatMessage(messages.quickView)}
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
}

Home.propTypes = {
  bookList: PropTypes.any,
  searchTerm: PropTypes.string,
  errorMessage: PropTypes.string,
  onChangeSearchTerm: PropTypes.func,
  onSubmitForm: PropTypes.func,
  intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
  home: makeSelectHome(),
  searchTerm: makeSelectSearchTerm(),
  errorMessage: makeSelectErrorMessage(),
  bookList: makeSelectBookList(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeSearchTerm: evt => dispatch(changeSearchTerm(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(requestBookSearch(evt.currentTarget.elements[0].value));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(Home);
