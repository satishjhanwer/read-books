import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .img-responsive{
    margin: auto;
    display: block;
    max-width: 100%;
    height: auto;
  }
  
  .space-ten{padding: 10px 0;}

  .thumbnail{
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
  }

  .book-list {
    display: inline-block;
  }

  .gallery-wrap .img-big-wrap img {
    height: auto;
    width: auto;
    display: inline-block;
  }

  .gallery-wrap .img-small-wrap .item-gallery {
    width: 100px;
    height: 100px;
    border: 1px solid #ddd;
    margin: auto 5px;
    display: inline-block;
    overflow: hidden;
    padding: 10px;
  }

  .gallery-wrap .img-small-wrap {
    text-align: center;
  }

  .gallery-wrap .img-small-wrap img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 4px;
    cursor: zoom-in;
  }
`;
