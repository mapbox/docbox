import React from 'react';
import Navigation from './navigation';
import PropTypes from 'prop-types';
import Content from './content';
import RoundedToggle from './rounded_toggle';
import GithubSlugger from 'github-slugger';
import debounce from 'lodash.debounce';
import { brandNames, brandClasses } from '../custom';
import qs from 'querystring';

let slugger = new GithubSlugger();
let slug = title => { slugger.reset(); return slugger.slug(title); };

let languageOptions = [
  { title: 'cURL',
    short: 'cURL',
    value: 'curl' },
  { title: 'CLI',
    short: 'cli',
    value: 'cli' },
  { title: 'Python',
    short: 'Python',
    value: 'python' },
  { title: 'JavaScript',
    short: 'JS',
    value: 'javascript' },
  { title: 'Java',
    short: 'Java',
    value: 'java' },
  { title: 'Objective-C',
    short: 'ObjC',
    value: 'objc' },
  { title: 'Swift',
    short: 'Swift',
    value: 'swift' }
];

let defaultLanguage = languageOptions[0];

let debouncedReplaceState = debounce(hash => {
  window.history.replaceState('', '', hash);
}, 100);

export default class App extends React.PureComponent {
  static propTypes = {
    content: PropTypes.string.isRequired,
    ast: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    var active = 'Introduction';

    if (process.browser) {
      let hash = window.location.hash.split('#').pop();
      let languageFromURL = qs.parse(window.location.search.substring(1)).language;
      let language = languageOptions.find(option => option.title === languageFromURL) ||
        defaultLanguage;
      let mqls = [
        { name: 'widescreen', query: window.matchMedia('(min-width: 1200px)') },
        { name: 'desktop', query: window.matchMedia('(min-width: 961px)') },
        { name: 'tablet', query: window.matchMedia('(max-width: 960px)') },
        { name: 'mobile', query: window.matchMedia('(max-width: 640px)') }
      ];
      mqls.forEach(q => q.query.addListener(this.mediaQueryChanged));
      if (hash) {
        let headingForHash = this.props.ast.children
          .filter(child => child.type === 'heading')
          .find(heading => heading.data.id === hash);
        if (headingForHash) {
          active = headingForHash.children[0].value;
        }
      }
      this.state = {
        // media queryMatches
        mqls: mqls,
        // object of currently matched queries, like { desktop: true }
        queryMatches: {},
        language: language,
        columnMode: 2,
        activeSection: active,
        // for the toggle-able navigation on mobile
        showNav: false
      };
    } else {
      this.state = {
        mqls: { },
        queryMatches: {
          desktop: true
        },
        language: defaultLanguage,
        activeSection: '',
        showNav: false
      };
    }
  }
  toggleNav = () => {
    this.setState({ showNav: !this.state.showNav });
  }
  componentDidMount() {
    this.mediaQueryChanged();
    this.onScroll = debounce(this.onScrollImmediate, 100);
    document.addEventListener('scroll', this.onScroll);
    this.onScrollImmediate();
  }
  onScrollImmediate = () => {
    var sections = document.querySelectorAll('div.section');
    if (!sections.length) return;
    for (var i = 0; i < sections.length; i++) {
      var rect = sections[i].getBoundingClientRect();
      if (rect.bottom > 0) {
        this.setState({
          activeSection: sections[i].getAttribute('data-title')
        });
        return;
      }
    }
  }
  mediaQueryChanged = () => {
    this.setState({
      queryMatches: this.state.mqls.reduce((memo, q) => {
        memo[q.name] = q.query.matches;
        return memo;
      }, {})
    });
  }
  componentWillUnmount() {
    this.state.mqls.forEach(q => q.removeListener(this.mediaQueryChanged));
    document.body.removeEventListener('scroll', this.onScroll);
  }
  onChangeLanguage = (language) => {
    this.setState({ language }, () => {
      if (window.history) {
        window.history.pushState(null, null,
          `?${qs.stringify({ language: language.title })}${window.location.hash}`);
      }
    });
  }
  componentDidUpdate(_, prevState) {
    if (prevState.activeSection !== this.state.activeSection) {
      // when the section changes, replace the hash
      debouncedReplaceState(`#${slug(this.state.activeSection)}`);
    } else if (prevState.language.title !== this.state.language.title ||
      prevState.columnMode !== this.state.columnMode) {
      // when the language changes, use the hash to set scroll
      window.location.hash = window.location.hash;
    }
  }
  navigationItemClicked = activeSection => {
    setTimeout(() => {
      this.setState({ activeSection });
    }, 10);
    if (!this.state.queryMatches.desktop) {
      this.toggleNav();
    }
  }
  toggleColumnMode = () => {
    this.setState({
      columnMode: this.state.columnMode === 1 ? 2 : 1
    });
  }
  render() {
    let ast = JSON.parse(JSON.stringify(this.props.ast));
    let { activeSection, queryMatches, showNav, columnMode } = this.state;
    let col1 = columnMode === 1 && queryMatches.desktop;
    return (<div className='container unlimiter'>

      {/* Content background */ }
      {(!col1 && !queryMatches.mobile) && <div className={`fixed-top fixed-right ${queryMatches.desktop && 'space-left16'}`}>
        <div className='fill-light col6 pin-right' />
      </div>}

      {/* Desktop nav */ }
      {queryMatches.desktop && <div className='space-top5 scroll-styled overflow-auto pad1 width16 sidebar fixed-left fill-dark dark'>
        <Navigation
          navigationItemClicked={this.navigationItemClicked}
          activeSection={activeSection}
          ast={ast} />
      </div>}

      {/* Content */ }
      <div className={`${queryMatches.desktop && 'space-left16'}`}>
        <div className={col1 ? 'col8 margin1' : ''}>
          <Content
            leftClassname={col1 ? 'space-bottom4 pad2x prose clip' : 'space-bottom8 col6 pad2x prose clip'}
            rightClassname={col1 ? 'space-bottom2 pad2 prose clip fill-light space-top5' : 'space-bottom4 col6 pad2 prose clip fill-light space-top5'}
            ast={ast}
            language={this.state.language}/>
        </div>
      </div>

      {/* Language toggle */ }
      <div className={`fixed-top ${queryMatches.desktop && 'space-left16'}`}>
        <div className={`events fill-light bottom-shadow pad1 ${col1 ? '' : 'col6 pin-topright'} ${queryMatches.tablet ? 'dark fill-blue' : ''} ${queryMatches.mobile ? 'space-top5 fixed-topright' : ''}`}>
          <div className='space-right1 small quiet inline'>
            Show examples in:
          </div>
          <RoundedToggle
            short={!queryMatches.widescreen}
            options={languageOptions}
            onChange={this.onChangeLanguage}
            active={this.state.language} />
          <div className='fr pad0'>
            {queryMatches.desktop ?
              <a
                title={`Display as ${col1 ? 2 : 1} column`}
                onClick={this.toggleColumnMode}
                style={{ cursor: 'pointer' }}
                className={`icon quiet caret-${col1 ? 'right' : 'left'} pad0 fill-darken0 round`} /> : null}
          </div>
        </div>
      </div>

      {/* Header */ }
      <div className={`fill-dark dark bottom-shadow fixed-top ${queryMatches.tablet ? 'pad1y pad2x col6' : 'pad0 width16'}`}>
        <a href='/' className={`active space-top1 space-left1 pin-topleft icon round dark pad0 ${brandClasses}`} />
        <div className={`strong small pad0
          ${queryMatches.mobile ? 'space-left3' : ''}
          ${queryMatches.tablet ? 'space-left2' : 'space-left4 line-height15' }`}>
          {queryMatches.desktop ? brandNames.desktop :
            queryMatches.mobile ? brandNames.mobile : brandNames.tablet}
        </div>
        {queryMatches.tablet && <div>
          <button
            onClick={this.toggleNav}
            className={`short quiet pin-topright button rcon ${showNav ? 'caret-up' : 'caret-down'} space-right1 space-top1`}>
            <span className='micro'>{activeSection}</span>
          </button>
          {showNav && <div
            className='fixed-left keyline-top fill-dark pin-left col6 pad2 scroll-styled space-top5'>
              <Navigation
                navigationItemClicked={this.navigationItemClicked}
                activeSection={activeSection}
                ast={ast} />
            </div>}
          </div>}
      </div>

    </div>);
  }
}
