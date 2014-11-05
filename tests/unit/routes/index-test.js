import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:index', 'IndexRoute', {
  // Specify the other units that are required for this test.
  needs: ['controller:index']
});

test('it exists', function() {
  var route = this.subject();
  ok(route);
});

test('it gets data', function () {
  expect(1);

  var route = this.subject();

  return route.getData()
              .then(function(response) {
                ok(response);
              });
});

test('it searches with a keyword', function () {
  expect(1);

  var route = this.subject();
  var searchTerm = 'test';

  return route.getData({
                'term': searchTerm
              })
              .then(function(response) {
                equal(response.query, searchTerm);
              });
});

test('it only gets images', function () {
  expect(4);

  var route = this.subject();

  return route.getData({
                'images': true,
                'videos': false,
                'audios': false,
                'documents': false
              })
        .then(function(response) {
          ok(response.images);
          ok(!response.videos);
          ok(!response.audios);
          ok(!response.articles);
        });
});

test('it only gets videos', function () {
  expect(4);

  var route = this.subject();

  return route.getData({
                'images': false,
                'videos': true,
                'audios': false,
                'documents': false
              })
        .then(function(response) {
          ok(!response.images);
          ok(response.videos);
          ok(!response.audios);
          ok(!response.articles);
        });
});

test('it only gets audios', function () {
  expect(4);

  var route = this.subject();

  return route.getData({
                'images': false,
                'videos': false,
                'audios': true,
                'documents': false
              })
        .then(function(response) {
          ok(!response.images);
          ok(!response.videos);
          ok(response.audios);
          ok(!response.articles);
        });
});

test('it only gets documents', function () {
  expect(4);

  var route = this.subject();

  return route.getData({
                'images': false,
                'videos': false,
                'audios': false,
                'documents': true
              })
        .then(function(response) {
          ok(!response.images);
          ok(!response.videos);
          ok(!response.audios);
          ok(response.articles);
        });
});