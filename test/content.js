/* global it describe */
var remark = require('remark');
var expect = require('expect');
var visit = require('unist-util-visit');
var select = require('unist-util-select');
var fs = require('fs');
var GithubSlugger = require('github-slugger');
var { linter } = require('eslint');
var allPages = require('../src/custom/content');

var slugger = new GithubSlugger();
var actionVerbs = /^(List|Retrieve|Remove|Search|Create|Delete)/;

let isSectionTitle = (title) => title.match(actionVerbs);
let getSectionTitle = chunk => chunk[0].children[0].value;

function extractSections(ast) {
  return ast.children.reduce((chunks, node) => {
    if (node.type === 'heading' && node.depth === 1) {
      return chunks;
    } else if (node.type === 'heading' && node.depth === 3) {
      chunks.push([node]);
    } else {
      chunks[chunks.length - 1].push(node);
    }
    return chunks;
  }, [[]])
  .filter(chunk => chunk.length)
  .filter(chunk => {
    return isSectionTitle(getSectionTitle(chunk));
  })
  .map(chunk => ({ type: 'root', children: chunk }));
}

var slugs = {};
describe('global rules', () => {
  var ast = remark().parse(allPages);
  var seen = {};
  /**
   * Check that titles are unique. This is to ensure that permalinks
   * are unique.
   */

  visit(ast, 'heading', node => {
    slugs['#' + slugger.slug(node.children[0].value)] = true;
    if (node.depth > 3) return;
    var {  value } = node.children[0];
    it('title ' + value + ' is unique', () => {
      expect(seen.hasOwnProperty(value))
        .toEqual(false, 'Title `' + value + '` should be unique');
      seen[value] = true;
    });
  });

});

describe('content', () => {
  fs.readdirSync('./content').forEach(function(file) {
    describe(file, () => {
      var content = fs.readFileSync('./content/' + file, 'utf8');
      var ast = remark().parse(content);

      it('links are valid', function() {
        visit(ast, 'link', node => {
          if (node.href && node.href[0] === '#') {
            expect(slugs[node.href])
              .toExist('A link to ' + node.href + ' at ' +
                  node.position.start.line + ' of ' + file + ' was invalid');
          }
        });
      });

      it('has h2 title', function() {
        expect(ast.children[0].type).toEqual('heading');
        expect(ast.children[0].depth).toEqual(2);
      });

      it('has API description', function() {
        expect(ast.children[1].type === 'paragraph' || ast.children[1].type === 'html').toEqual(true);
      });

      it('has valid json', () => {
        select(ast, 'code[lang=json]').forEach(node => {
          expect(function() {
            JSON.parse(node.value);
          }).not.toThrow('a JSON code block at L:' +
            node.position.start.line + ' of ' + file + ' was invalid');
        });
      });

      it('has valid javascript', () => {
        select(ast, 'code[lang=javascript]').forEach(node => {
          var messages = linter.verify(node.value);
          expect(messages).toEqual([], 'a JS code block at L:' +
            node.position.start.line + ' of ' + file + ' was invalid');
        });
      });

      extractSections(ast).forEach(chunk => {
        describe(getSectionTitle(chunk.children), function() {
          it('has an endpoint and that endpoint has a valid method', () => {
            var endpoint = select(chunk, 'code[lang=endpoint]');
            expect(endpoint.length).toBeGreaterThan(0);
            expect(endpoint[0].value.toString()).toMatch(/^(PUT|POST|GET|DELETE|PATCH)/);
          });
          it('has python example', () => {
            expect(select(chunk, 'code[lang=python]').length).toBeGreaterThan(0);
          });
          it('has js example', () => {
            expect(select(chunk, 'code[lang=javascript]').length).toBeGreaterThan(0);
          });
          it('has curl example', () => {
            expect(select(chunk, 'code[lang=curl]').length).toBeGreaterThan(0);
          });
        });
      });
    });
  });
});
