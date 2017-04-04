'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('collaboration', 'files', (test) => {
  //Test for get files
  test.withOptions({qs : { 'where' : 'types = "images" '}}).should.return200OnGet();
    test.should.supportPagination();

//test for CRD operations on files
let fileId;
it(`should allow PUT {test.api}`,() => {
  return cloud.withOptions({qs : {'fileName' : 'zfile.png'}}).putFile(test.api,'./assets/zfile.png');
});
  it(`should allow RD {test.api}`,() => {
    return cloud.get(test.api)
    .then (r => fileId = r.body[0].id )
    .then (r => cloud.withOptions({qs : {'fileId' : fileId}}).get(`${test.api}/${fileId}`))
    .then (r => cloud.withOptions({qs : {'fileId' : fileId}}).delete(`${test.api}/${fileId}`));
  });

// Tests for actions on 'files'
let fileActionPayload=[
  { 'action' : 'share'},
  { 'action' : 'revoke'}
];

it(`should allow PATCH {test.api}/:fileId/actions`,() => {
  return cloud.get(test.api)
  .then (r => fileId = r.body[0].id )
  .then (r => fileActionPayload.forEach( fAction => cloud.patch(`${test.api}/${fileId}/actions`,fAction)));
});

// Tests for comments on 'files'
let fileCommentPayload={
  'comment' : 'This is temporary comment on file '
};
let commentId;
it(`should allow CUD {test.api}/:fileId/comment`,() => {
  return cloud.get(`${test.api}`)
.then (r => fileId = r.body[0].id )
.then (r => cloud.withOptions({qs : {'fileId' : fileId}}).post(`${test.api}/${fileId}/comment`,fileCommentPayload))
.then (r => commentId = r.body.id)
.then (r => cloud.withOptions({qs :{'fileId' : fileId, 'commentId' : commentId}}).patch(`${test.api}/${fileId}/comment/${commentId}`,{'comment' : 'Updated Comment'}))
.then (r => cloud.withOptions({qs :{'fileId' : fileId, 'commentId' : commentId}}).delete(`${test.api}/${fileId}/comment/${commentId}`));
});

});
