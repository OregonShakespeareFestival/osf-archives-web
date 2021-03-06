import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:index', 'IndexRoute', {
  // Specify the other units that are required for this test.
  needs: [
    'controller:index',
    'controller:images',
    'template:images'
  ]
});

test('it exists', function() {
  var route = this.subject();
  ok(route);
});

test('it requires type', function () {
  expect(1);

  var route = this.subject();

  throws(function () {
    route.buildSearchQuery();
  }, 'Type is required.');
});

test('it gets data', function () {
  expect(3);

  var route = this.subject();

  return route.getData({ type: 'images' })
              .then(function(response) {
                ok(response);
                ok(response.query);
                ok(response.filters);
              });
});

test('it searches with a keyword', function () {
  expect(1);

  var route = this.subject();
  var searchTerm = 'test';

  return route.getData({
                'type': 'images',
                'term': searchTerm
              })
              .then(function(response) {
                equal(response.query, searchTerm);
              });
});

test('it only gets images', function () {
  expect(2);

  var route = this.subject();

  return route.getData({ type: 'images' })
        .then(function(response) {
          ok(response.data);
          equal(response.type, 'images');
        });
});

test('it only gets videos', function () {
  expect(2);

  var route = this.subject();

  return route.getData({ type: 'videos' })
        .then(function(response) {
          ok(response.data);
          equal(response.type, 'videos');
        });
});

test('it only gets audios', function () {
  expect(2);

  var route = this.subject();

  return route.getData({ type: 'audios' })
        .then(function(response) {
          ok(response.data);
          equal(response.type, 'audios');
        });
});

test('it only gets documents', function () {
  expect(2);

  var route = this.subject();

  return route.getData({ type: 'articles' })
        .then(function(response) {
          ok(response.data);
          equal(response.type, 'articles');
        });
});

test('it builds a search url', function () {
  expect(1);

  var route = this.subject();

  ok(route.buildSearchQuery({ type: 'images' }));
});

test('it gets page index', function () {
  expect(1);

  var route = this.subject();

  return route.getData({ type: 'images' }).then(function(response) {
    route.bindData(response);
    equal(route.getPageIndex('images', 1), 2);
  });

});