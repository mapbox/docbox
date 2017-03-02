import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './components/app';
import remark from 'remark';
import slug from 'remark-slug';
import content from './custom/content';
import fs from 'fs';

var ast = remark()
  .use(slug)
  .runSync(remark().parse(content));

var template = fs.readFileSync('./index.html', 'utf8');

var target = process.argv[2];

var startDiv = `<div id='app'>`;
var stopDiv = '</div>';
var startMarker = '<!--START-->' + startDiv;
var stopMarker = stopDiv + '<!--STOP-->';
var startIdx = template.indexOf(startMarker) + startMarker.length;
var stopIdx = template.indexOf(stopMarker);

fs.writeFileSync(target,
  template.substring(0, startIdx) +
  ReactDOMServer.renderToString(<App ast={ast} content={content} />) +
  template.substring(stopIdx));
