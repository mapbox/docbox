import React from 'react';
import remark from 'remark';
import PropTypes from 'prop-types';
import remarkHTML from 'remark-html';
import remarkHighlight from '../highlight';
import { postHighlight, remarkPlugins } from '../custom';

function renderHighlighted(nodes) {
  return {
    __html: postHighlight(remark()
      .use(remarkHTML)
      .stringify(remark()
        .use(remarkHighlight)
        .use(remarkPlugins)
        .runSync({
          type: 'root',
          children: nodes
        })))
  };
}

export default class Section extends React.PureComponent {
  static propTypes = {
    chunk: PropTypes.object.isRequired,
    leftClassname: PropTypes.string.isRequired,
    rightClassname: PropTypes.string.isRequired
  }
  render() {
    let { chunk, leftClassname, rightClassname } = this.props;
    let { left, right, preview } = chunk;
    return (<div
      data-title={chunk.title}
      className={`keyline-top section contain clearfix ${preview ? 'preview' : ''}`}>
      <div
        className={leftClassname}
        dangerouslySetInnerHTML={renderHighlighted(left)} />
      {right.length > 0 && <div
        className={rightClassname}
        dangerouslySetInnerHTML={renderHighlighted(right)} />}
    </div>);
  }
}
