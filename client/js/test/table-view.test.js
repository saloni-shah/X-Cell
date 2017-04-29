const fs = require('fs');
const TableModel = require('../table-model');
const TableView = require('../table-view');

describe('table-view', () => {
	beforeEach(() => {
		const fixturepath = './client/js/test/fixtures/sheet-container.html';
		const html = fs.readFileSync(fixturepath,'utf8');
		document.documentElement.innerHTML = html;
	});
	describe('formula bar', () => {
		it('makes changes TD the value of the current cell', () => {
			const model = new TableModel(3,3);
			const view = new TableView(model);
			view.init();

			let trs = document.querySelectorAll('TBODY TR');
			let td = trs[0].cells[0];
			expect(td.textContent).toBe('');

			document.querySelector('#formulabar').value = '65';
			view.handleFormulaBarChange();

			trs = document.querySelectorAll('TBODY TR');
			expect(trs[0].cells[0].textContent).toBe('65');

		});

		it('updates value from current cell', () => {
	
			const model = new TableModel(3,3);
			const view = new TableView(model);
			model.setValue({col:2,row:1},'123');
			view.init();

			const formulabarEl = document.querySelector('#formulabar');
			expect(formulabarEl.value).toBe('');

			let trs = document.querySelectorAll('TBODY TR');
			trs[1].cells[2].click();
			expect(formulabarEl.value).toBe('123');

		});
	});
	describe('table body', () => {
		it('highlighs the current cell when clicked', () => {
		
			const model = new TableModel(5,5);
			const view = new TableView(model);
			view.init();

			let trs = document.querySelectorAll('TBODY TR');
			let td = trs[2].cells[3];
			expect(td.className).toBe('');

			td.click();
			trs = document.querySelectorAll('TBODY TR');
			td = trs[2].cells[3];
			expect(td.className).not.toBe('');

		});
		it('has right size', () => {
			const numCols = 6;
			const numRows = 10;
			const model = new TableModel(numCols,numRows);
			const view = new TableView(model);
			view.init();

			let ths = document.querySelectorAll('THEAD TH');
			expect(ths.length).toBe(numCols);

		});
		it('fills in values from model', () => {
			const model = new TableModel(3,3);
			const view = new TableView(model);
			model.setValue({col:2,row:1},'123');
			view.init();

			const trs = document.querySelectorAll('TBODY TR');
			expect(trs[1].cells[2].textContent).toBe('123');
		});
	});
	describe('table header', () => {
		it('has valid column header labels', () => {
			const numCols = 6;
			const numRows = 10;
			const model = new TableModel(numCols,numRows);
			const view = new TableView(model);
			view.init();

			let ths = document.querySelectorAll('THEAD TH');
			expect(ths.length).toBe(numCols);

			let labelTexts = Array.from(ths).map(el => el.textContent);
			expect(labelTexts).toEqual(['A','B','C','D','E','F']);
		});
	});
});