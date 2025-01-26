/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Routes } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import Navigation from '../../components/Navigation/Loadable';
import HomePage from '../HomePage/Loadable';
import AuthorDetailPage from '../AuthorDetails/Loadable';
import BookDetailPage from '../BookDetails/Loadable';
import NotFoundPage from '../NotFoundPage/Loadable';

export default function App() {
  return (
    <>
      <Helmet titleTemplate="%s - Search Books" defaultTitle="Search Books">
        <meta name="description" content="A React.js application for searching books" />
      </Helmet>
      <Navigation />
      <Container>
        <Row>
          <Col sm="12">
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route path="/book/:id" element={<BookDetailPage />} />
              <Route path="/author/:id" element={<AuthorDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
}
