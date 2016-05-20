import React from 'react';
import remark from 'remark';
import remarkHTML from 'remark-html';
import remarkHighlight from '../highlight';
import PureRenderMixin from 'react-pure-render/mixin';
import { postHighlight, remarkPlugins } from '../custom';

function renderHighlighted(nodes) {
  return {
    __html: postHighlight(remark()
      .use(remarkHTML)
      .stringify(remark()
        .use(remarkHighlight)
        .use(remarkPlugins)
        .run({
          type: 'root',
          children: nodes
        })))
  };
}

var Section = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    chunk: React.PropTypes.object.isRequired,
    leftClassname: React.PropTypes.string.isRequired,
    rightClassname: React.PropTypes.string.isRequired
  },
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
});

module.exports = Section;
