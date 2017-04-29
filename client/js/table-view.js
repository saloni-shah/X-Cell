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
