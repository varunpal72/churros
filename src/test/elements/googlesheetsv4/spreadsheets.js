'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const spreadSheetPayload = tools.requirePayload(`${__dirname}/assets/spreadsheets.json`);
const spreadSheetUpdatePayload = tools.requirePayload(`${__dirname}/assets/spreadsheetsupdate.json`);
const newspreadSheetPayload = tools.requirePayload(`${__dirname}/assets/newspreadsheets.json`);
const destSpreadsheetPayload = tools.requirePayload(`${__dirname}/assets/destSpreadsheetId.json`);
const workSheetPayload = tools.requirePayload(`${__dirname}/assets/worksheets.json`);
const workSheetUpdatePayload = tools.requirePayload(`${__dirname}/assets/worksheetsupdate.json`);
const multipleCellsPayload = tools.requirePayload(`${__dirname}/assets/multiplecells.json`);
const multipleCellsUpdatePayload = tools.requirePayload(`${__dirname}/assets/multiplecellsupdate.json`);
const rowPayload = tools.requirePayload(`${__dirname}/assets/row.json`);
const rowUpdatePayload = tools.requirePayload(`${__dirname}/assets/rowupdate.json`);


suite.forElement('general', 'spreadsheets', (test) => {
let spreadsheetId;
let sheetId;
let destsheetId;
let worksheetName;
let range;
let rowId;

  test.should.supportPagination();

  it('should allow CU for /spreadsheets', () => {
    return cloud.get(test.api)
    .then(r => cloud.post(test.api, spreadSheetPayload))
    .then(r => spreadsheetId = r.body.spreadsheetId)
    .then(r => cloud.put(`${test.api}/${spreadsheetId}`, spreadSheetUpdatePayload));
  });

  it('should allow CRUD for /spreadsheets/{spreadsheetId}/worksheets',() =>{
    return cloud.post(`${test.api}/${spreadsheetId}/worksheets`, workSheetPayload)
    .then(r =>sheetId = r.body[0].sheetId)
    .then(r => cloud.put(`${test.api}/${spreadsheetId}/worksheets/${sheetId}`,workSheetUpdatePayload ))
    .then(r => cloud.get(`${test.api}/${spreadsheetId}/worksheets/${sheetId}`))
    .then(r => worksheetName = r.body.title);
    //.then(r => cloud.delete(`${test.api}/${spreadsheetId}/worksheets/${sheetId}`))
   });


     it('should allow CRUD for /spreadsheets/{spreadsheetId}/worksheets{worksheetName}/multiples', () => {
      return cloud.post(`${test.api}/${spreadsheetId}/worksheets/${worksheetName}/multiples`,multipleCellsPayload)
      .then(r => range = 'A1')
      .then(r => cloud.put(`${test.api}/${spreadsheetId}/worksheets/${worksheetName}/multiples/${range}`,multipleCellsUpdatePayload))
      .then(r => cloud.delete(`${test.api}/${spreadsheetId}/worksheets/${worksheetName}/multiples/${range}`));
     });

     it('should allow CRUD for /spreadsheets/{spreadsheetId}/worksheets{worksheetName}/rows', () => {
      return cloud.post(`${test.api}/${spreadsheetId}/worksheets/${worksheetName}/rows`,rowPayload)
      .then(r => rowId = 'C3')
      .then(r => cloud.put(`${test.api}/${spreadsheetId}/worksheets/${worksheetName}/rows/${rowId}`,rowUpdatePayload))
      .then(r => cloud.delete(`${test.api}/${spreadsheetId}/worksheets/${worksheetName}/rows/${rowId}`));
     });



     it('should allow copy worksheet /spreadsheets/{spreadsheetId}/worksheets/{sheetId}:copyTo', () =>{
       return cloud.post(test.api, newspreadSheetPayload)
       .then(r => {destsheetId = r.body.spreadsheetId});
       .then(r => cloud.post(`${test.api}/${spreadsheetId}/worksheets/${sheetId}/copy`,destSpreadsheetPayload));
        });

});
