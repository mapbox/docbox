import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import remark from 'remark';
import slug from 'remark-slug';
import content from './custom/content';

var ast = remark()
  .use(slug)
  .runSync(remark().parse(content));

ReactDOM.render(
  <App ast={ast} content={content} />,
  document.getElementById('app'));
