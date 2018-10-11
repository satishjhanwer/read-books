/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import Navigation from 'components/Navigation/Loadable';
import HomePage from 'containers/Home/Loadable';
import AuthorDetailPage from 'containers/AuthorDetails/Loadable';
import BookDetailPage from 'containers/BookDetails/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

export default function App() {
  return (
    <React.Fragment>
      <Helmet>
        <title>Home</title>
        <meta name="description" content="Home" />
      </Helmet>
      <Navigation />
      <Container>
        <Row>
          <Col sm="12">
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/book/:id" component={BookDetailPage} />
              <Route path="/author/:id" component={AuthorDetailPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}
