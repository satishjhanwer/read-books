/**
 *
 * AuthorDetails
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

import { makeSelectAuthorInfo } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { authorInfoRequest } from './actions';

const key = 'authorDetails';

export function AuthorDetails({
  match: {
    params: { id },
  },
  authorInfo,
  fetchAuthorInfo,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    // Load the book details if the id is present in the url params
    if (id) {
      fetchAuthorInfo(id);
    }
  }, []);
  return (
    <>
      {authorInfo && (
        <>
          <div className="card">
            <div className="row">
              <aside className="col-sm-5 border-right">
                <article className="gallery-wrap">
                  <div className="img-big-wrap">
                    <img src={authorInfo.image_url} alt="" />
                  </div>
                  <div className="img-small-wrap">
                    <h3 className="mb-3" style={{ marginTop: '20px' }}>
                      <FormattedMessage {...messages.books} />
                    </h3>
                    {authorInfo.books && authorInfo.books.length > 0 ? (
                      authorInfo.books.map((book) => (
                        <div className="item-gallery" key={book.id}>
                          <Link to={`/book/${book.id}`}>
                            <img src={book.small_image_url} alt="" />
                          </Link>
                        </div>
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                </article>
              </aside>
              <aside className="col-sm-7">
                <article className="card-body p-5">
                  <h3 className="title mb-3">{authorInfo.name}</h3>
                  <dl className="item-property">
                    <dt>
                      <FormattedMessage {...messages.about} />
                    </dt>
                    <dd>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: authorInfo.about,
                        }}
                      />
                    </dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>
                      <FormattedMessage {...messages.gender} />
                    </dt>
                    <dd>{authorInfo.gender}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>
                      <FormattedMessage {...messages.born} />
                    </dt>
                    <dd>{authorInfo.born_at}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>
                      <FormattedMessage {...messages.died} />
                    </dt>
                    <dd>{authorInfo.died_at}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>
                      <FormattedMessage {...messages.hometown} />
                    </dt>
                    <dd>{authorInfo.hometown}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>
                      <FormattedMessage {...messages.followers} />
                    </dt>
                    <dd>{authorInfo.author_followers_count}</dd>
                  </dl>
                  <dl className="param param-feature">
                    <dt>
                      <FormattedMessage {...messages.fans} />
                    </dt>
                    <dd>{authorInfo.fans_count}</dd>
                  </dl>
                  <hr />
                </article>
              </aside>
            </div>
          </div>
        </>
      )}
    </>
  );
}

AuthorDetails.propTypes = {
  fetchAuthorInfo: PropTypes.func,
  authorInfo: PropTypes.object,
  match: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  authorInfo: makeSelectAuthorInfo(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchAuthorInfo: (id) => dispatch(authorInfoRequest(id)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(AuthorDetails);
