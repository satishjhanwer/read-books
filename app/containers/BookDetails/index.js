/**
 *
 * BookDetails
 *
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';

import { makeSelectBookInfo } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { requestBookInfo } from './actions';

const key = 'bookDetails';

export function BookDetails({
  match: {
    params: { id },
  },
  bookObj,
  fetchBookInfo,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    // Load the book details if the id is present in the url params
    if (id) {
      fetchBookInfo(id);
    }
  }, []);
  return bookObj ? (
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
                <FormattedMessage {...messages.by} />
                <Link to={`/author/${bookObj.author.id}`}>{bookObj.author.name}</Link>
              </span>
            </p>
            <dl className="item-property">
              <dt>
                <FormattedMessage {...messages.description} />
              </dt>
              <dd>
                <p
                  dangerouslySetInnerHTML={{
                    __html: bookObj.description,
                  }}
                />
              </dd>
            </dl>
            <dl className="param param-feature">
              <dt>
                <FormattedMessage {...messages.isbn} />
              </dt>
              <dd>{bookObj.isbn}</dd>
            </dl>
            <dl className="param param-feature">
              <dt>
                <FormattedMessage {...messages.publicationYear} />
              </dt>
              <dd>{bookObj.publication_year}</dd>
            </dl>
            <dl className="param param-feature">
              <dt>
                <FormattedMessage {...messages.publisher} />
              </dt>
              <dd>{bookObj.publisher}</dd>
            </dl>
            <dl className="param param-feature">
              <dt>
                <FormattedMessage {...messages.format} />
              </dt>
              <dd>{bookObj.format}</dd>
            </dl>
            <dl className="param param-feature">
              <dt>
                <FormattedMessage {...messages.rating} />
              </dt>
              <dd>{bookObj.text_reviews_count}</dd>
            </dl>
            <dl className="param param-feature">
              <dt>
                <FormattedMessage {...messages.rating} />
              </dt>
              <dd>{bookObj.average_rating}</dd>
            </dl>
            <hr />
          </article>
        </aside>
      </div>
    </div>
  ) : (
    <></>
  );
}

BookDetails.propTypes = {
  fetchBookInfo: PropTypes.func,
  bookObj: PropTypes.any,
  match: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  bookObj: makeSelectBookInfo(),
});

function mapDispatchToProps(dispatch) {
  return { fetchBookInfo: (id) => dispatch(requestBookInfo(id)) };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(BookDetails);
