import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { pagination } from './pagination.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() paginationData: pagination;
  @Input() currentPage: number;

  @Output() changes = new EventEmitter<any>();
  
  private maxShowPages: number = 7;
  
  showPages: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  constructor() { }

  ngOnInit() {
    this.updateCurrentPage();
  }

  goFirstPage(e) {
    e.preventDefault();
    if (this.currentPage != 1) {
      this.changes.emit(this.paginationData.first);
    }
  }

  goPrevPage(e) {
    e.preventDefault();
    this.changes.emit(this.paginationData.prev);
  }

  goToPage(e, page: number) {
    e.preventDefault();
    this.changes.emit(page);
  }

  goNextPage(e) {
    e.preventDefault();
    this.changes.emit(this.paginationData.next);
  }

  goLastPage(e) {
    e.preventDefault();
    this.changes.emit(this.paginationData.last);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['paginationData']) {
      this.updateCurrentPage();
    }
  }

  updateCurrentPage() {
    let component = this;
    let initPage = 0;
    let step = Math.ceil(component.maxShowPages/2);
    let maxPage = component.paginationData.last ? component.paginationData.last : component.currentPage;
    if(component.currentPage > step) {
      initPage = component.currentPage - step;
    } 
    if((component.paginationData.last) < (step + component.currentPage)) {
      initPage = maxPage - component.maxShowPages;
    }
    let tmpShowPages = [];
    for (let index = 1; index <= component.maxShowPages; index++) {
      tmpShowPages.push(initPage + index);
    }
    component.showPages = tmpShowPages;
  }
}
