import React from 'react';
import PropTypes from 'prop-types';

export default class NavigationItem extends React.PureComponent {
  static propTypes = {
    sectionName: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    href: PropTypes.string.isRequired
  }
  onClick = () => {
    this.props.onClick(this.props.sectionName);
  }
  render() {
    var {sectionName, href, active} = this.props;
    return (<a
      href={href}
      onClick={this.onClick}
      className={`line-height15 pad0x pad00y quiet block ${active ? 'fill-lighten0 round' : ''}`}>
      {sectionName}
    </a>);
  }
}
