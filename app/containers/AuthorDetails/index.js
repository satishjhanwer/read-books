/**
 *
 * AuthorDetails
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
import { makeSelectAuthorInfo, makeSelectAuthorDetails } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { authorInfoRequest } from './actions';

/* eslint-disable react/prefer-stateless-function */
export class AuthorDetails extends React.Component {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      fetchAuthorInfo,
    } = this.props;
    if (id) {
      fetchAuthorInfo(id);
    }
  }

  render() {
    const {
      authorInfo,
      intl: { formatMessage },
    } = this.props;
    return (
      <React.Fragment>
        <Helmet>
          <title>{formatMessage(messages.header)}</title>
          <meta name="description" content={formatMessage(messages.header)} />
        </Helmet>
        {authorInfo && (
          <div className="card">
            <div className="row">
              <aside className="col-sm-5 border-right">
                <article className="gallery-wrap">
                  <div className="img-big-wrap">
                    <img src={authorInfo.image_url} alt="" />
                  </div>
                  <div className="img-small-wrap">
                    <h3 className="mb-3" style={{ marginTop: '20px' }}>
                      {formatMessage(messages.books)}
                    </h3>
                    {authorInfo.books && authorInfo.books.length > 0 ? (
                      authorInfo.books.map(book => (
                        <div className="item-gallery" key={book.id}>
                          <Link to={`/book/${book.id}`}>
                            <img src={book.small_image_url} alt="" />
                          </Link>
                        </div>
                      ))
                    ) : (
                      <React.Fragment />
                    )}
                  </div>
                </article>
              </aside>
              <aside className="col-sm-7">
                <article className="card-body p-5">
                  <h3 className="title mb-3">{authorInfo.name}</h3>
                  <dl className="item-property">
                    <dt>{formatMessage(messages.about)}</dt>
                    <dd>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: authorInfo.about,
                        }}
                      />
                    </dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>{formatMessage(messages.gender)}</dt>
                    <dd>{authorInfo.gender}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>{formatMessage(messages.born)}</dt>
                    <dd>{authorInfo.born_at}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>{formatMessage(messages.died)}</dt>
                    <dd>{authorInfo.died_at}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>{formatMessage(messages.hometown)}</dt>
                    <dd>{authorInfo.hometown}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>{formatMessage(messages.followers)}</dt>
                    <dd>{authorInfo.author_followers_count}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt> {formatMessage(messages.fans)}</dt>
                    <dd>{authorInfo.fans_count}</dd>
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

AuthorDetails.propTypes = {
  fetchAuthorInfo: PropTypes.func,
  authorInfo: PropTypes.object,
  match: PropTypes.any,
  intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
  authorDetails: makeSelectAuthorDetails(),
  authorInfo: makeSelectAuthorInfo(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchAuthorInfo: id => dispatch(authorInfoRequest(id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'authorDetails', reducer });
const withSaga = injectSaga({ key: 'authorDetails', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AuthorDetails);
