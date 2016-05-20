import React from 'react';
import PureRenderMixin from 'react-pure-render/mixin';

var roundedToggleOptionType = React.PropTypes.shape({
  title: React.PropTypes.string,
  value: React.PropTypes.string
});

var RoundedToggle = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    options: React.PropTypes.arrayOf(roundedToggleOptionType).isRequired,
    active: roundedToggleOptionType,
    short: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired
  },
  render() {
    let { options, active } = this.props;
    return (<div className='rounded-toggle inline short'>
      {options.map(option =>
        <RoundedToggleOption
          key={option.value}
          option={option}
          short={this.props.short}
          onClick={this.props.onChange}
          className={`strong ${option.value === active.value ? 'active': ''}`} />)}
    </div>);
  }
});

var RoundedToggleOption = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    option: roundedToggleOptionType,
    className: React.PropTypes.string.isRequired,
    short: React.PropTypes.bool,
    onClick: React.PropTypes.func.isRequired
  },
  onClick() {
    this.props.onClick(this.props.option);
  },
  render() {
    let { className, option } = this.props;
    return (<a
      onClick={this.onClick}
      className={className}>{this.props.short ? option.short : option.title}</a>);
  }
});

module.exports = RoundedToggle;
