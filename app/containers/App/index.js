/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import Navigation from 'components/Navigation/Loadable';
import HomePage from 'containers/HomePage/Loadable';
import AuthorDetailPage from 'containers/AuthorDetails/Loadable';
import BookDetailPage from 'containers/BookDetails/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import GlobalStyle from '../../global-styles';

export default function App() {
  return (
    <React.Fragment>
      <Helmet titleTemplate="%s - Search Books" defaultTitle="Search Books">
        <meta name="description" content="A React.js application for searching books" />
      </Helmet>
      <Navigation />
      <Container>
        <Row>
          <Col sm="12">
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/book/:id" component={BookDetailPage} />
              <Route path="/author/:id" component={AuthorDetailPage} />
              <Route path="" component={NotFoundPage} />
            </Switch>
          </Col>
        </Row>
        <GlobalStyle />
      </Container>
    </React.Fragment>
  );
}
