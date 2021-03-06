(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const TableModel = require('./table-model');
const TableView = require('./table-view');

const model = new TableModel();
const tableview = new TableView(model);
tableview.init();
},{"./table-model":4,"./table-view":5}],2:[function(require,module,exports){
const getRange = function(fromNum, toNum){
	return Array.from({length: toNum-fromNum+1}, (unused,i) => i+fromNum);
};
const getLetterRange = function(firstLetter, numLetters){
	const rangeStart = firstLetter.charCodeAt(0);
	const rangeEnd = rangeStart + numLetters - 1;
	return getRange(rangeStart,rangeEnd)
		.map(charCode => String.fromCharCode(charCode));
};
module.exports = {
	getRange : getRange,
	getLetterRange : getLetterRange
};
},{}],3:[function(require,module,exports){
const removeChildren = function(parentEl){
	while(parentEl.firstChild){
		parentEl.removeChild(parentEl.firstChild);
	}
};
const createEl = function(tagName){
	return function(text){
		const el = document.createElement(tagName);
		if(text){
			el.textContent = text;
		}
		return el;
	};
};

const createTR = createEl('TR');
const createTH = createEl('TH');
const createTD = createEl('TD');

module.exports = {
	createTR: createTR,
	createTH: createTH,
	createTD: createTD,
	removeChildren: removeChildren
};
},{}],4:[function(require,module,exports){
class TableModel{
	constructor(numCols=5,numRows=4){
		this.numCols = numCols;
		this.numRows = numRows;
		this.data = {};
	}
	_getCellId(location){
		return `${location.col}:${location.row}`;
	}
	getValue(location){
		return this.data[this._getCellId(location)];
	}
	setValue(location,value){
		this.data[this._getCellId(location)] = value;
	}
}
module.exports = TableModel;
},{}],5:[function(require,module,exports){
const { getLetterRange } = require('./array-util');
const { createTR, createTH, createTD, removeChildren } = require('./dom-util');
class TableView{
	constructor(model){
		this.model = model;
	}
	init(){
		this.initDomReferences();
		this.initCurrentCell();
		this.renderTable();
		this.attachEventHandlers();
	}
	initDomReferences(){
		this.headerRowEl = document.querySelector('THEAD TR');
		this.sheetbodyEl = document.querySelector('TBODY');
		this.formulabarEl = document.querySelector('#formulabar');
	
	}
	initCurrentCell(){
		this.currentCellLocation = {col:0,row:0};
		this.renderFormulaBar();
	}
	normalizeValueForRendering(value){
		return value || '';
	}
	renderFormulaBar(){
		const currentCellValue = this.model.getValue(this.currentCellLocation);
		this.formulabarEl.value = this.normalizeValueForRendering(currentCellValue);
		this.formulabarEl.focus();
	}
	renderTable(){
		this.renderTableHeader();
		this.renderTableBody();

	}
	renderTableHeader(){
		removeChildren(this.headerRowEl);
		getLetterRange('A',this.model.numCols)
		.map(colLabel => createTH(colLabel))
		.forEach(th => this.headerRowEl.appendChild(th));
	}
	isCurrentCell(col,row){
		return this.currentCellLocation.col === col 
		&& this.currentCellLocation.row === row;
	}
	renderTableBody(){
		const fragment = document.createDocumentFragment();
		for(let row=0;row<this.model.numRows;row++){
			const tr = createTR();
			for(let col=0;col<this.model.numCols;col++){
				const position = {col:col,row:row};
				const value = this.model.getValue(position);
				const td = createTD(value);
				if(this.isCurrentCell(col,row)){
					td.className = 'current-cell';
				}

				tr.appendChild(td);
			}
			fragment.appendChild(tr);
		}
		removeChildren(this.sheetbodyEl);
		this.sheetbodyEl.appendChild(fragment);
	}
	attachEventHandlers(){
		this.sheetbodyEl.addEventListener('click',this.handleSheetClick.bind(this));
		this.formulabarEl.addEventListener('keyup',this.handleFormulaBarChange.bind(this));
	}
	isColumnHeaderRow(row){
		return row < 1;
	}
	handleFormulaBarChange(e){
		const value = this.formulabarEl.value;
		this.model.setValue(this.currentCellLocation,value);
		this.renderTableBody();
	}
	handleSheetClick(e){
		const col = e.target.cellIndex;
		var row = e.target.parentElement.rowIndex;

		if(!this.isColumnHeaderRow(row)){
			row = row-1;
			this.currentCellLocation = {col:col,row:row};
			this.renderTableBody();
		}
		this.renderFormulaBar();
	}
}
module.exports = TableView;

},{"./array-util":2,"./dom-util":3}]},{},[1]);
