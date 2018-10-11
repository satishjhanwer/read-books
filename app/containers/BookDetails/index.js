/**
 *
 * BookDetails
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectBookInfo } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { requestBookInfo } from './actions';

/* eslint-disable react/prefer-stateless-function */
export class BookDetails extends React.Component {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      fetchBookInfo,
    } = this.props;
    if (id) {
      fetchBookInfo(id);
    }
  }

  render() {
    const {
      bookObj,
      intl: { formatMessage },
    } = this.props;
    return (
      <React.Fragment>
        <Helmet>
          <title>{formatMessage(messages.header)}</title>
          <meta name="description" content="Book Details" />
        </Helmet>
        {bookObj && (
          <div className="card">
            <div className="row">
              <aside className="col-sm-5 border-right">
                <article className="gallery-wrap">
                  <div className="img-big-wrap">
                    <img src={bookObj.image_url} alt="" />
                  </div>
                </article>
              </aside>
              <aside className="col-sm-7">
                <article className="card-body p-5">
                  <h3 className="title mb-3">{bookObj.title}</h3>
                  <p className="price-detail-wrap">
                    <span>
                      {formatMessage(messages.by)}
                      <Link to={`/author/${bookObj.author.id}`}>
                        {bookObj.author.name}
                      </Link>
                    </span>
                  </p>
                  <dl className="item-property">
                    <dt>{formatMessage(messages.description)}</dt>
                    <dd>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: bookObj.description,
                        }}
                      />
                    </dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>{formatMessage(messages.isbn)}</dt>
                    <dd>{bookObj.isbn}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>{formatMessage(messages.publicationYear)}</dt>
                    <dd>{bookObj.publication_year}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>{formatMessage(messages.publisher)}</dt>
                    <dd>{bookObj.publisher}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>{formatMessage(messages.format)}</dt>
                    <dd>{bookObj.format}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt> {formatMessage(messages.review)}</dt>
                    <dd>{bookObj.text_reviews_count}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>{formatMessage(messages.rating)}</dt>
                    <dd>{bookObj.average_rating}</dd>
                  </dl>
                  <hr />
                </article>
              </aside>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

BookDetails.propTypes = {
  fetchBookInfo: PropTypes.func,
  bookObj: PropTypes.any,
  match: PropTypes.any,
  intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
  bookObj: makeSelectBookInfo(),
});

function mapDispatchToProps(dispatch) {
  return { fetchBookInfo: id => dispatch(requestBookInfo(id)) };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'bookDetails', reducer });
const withSaga = injectSaga({ key: 'bookDetails', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(BookDetails);
