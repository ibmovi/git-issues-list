import { Component, OnInit, OnChanges, Input, Output,  EventEmitter, SimpleChanges } from '@angular/core';
import { pagination } from './pagination.model';
/**
 * Pagination issues list
 * @export
 * @class PaginationComponent
 * @implements {OnInit}
 * @implements {OnChanges}
 */
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
  
  /**
   * Creates an instance of PaginationComponent.
   * @memberof PaginationComponent
   */
  constructor() { }

  ngOnInit() {
    this.updatePaginationShowPage();
  }

  goFirstPage(e: any) {
    e.preventDefault();
    if (this.currentPage != 1) {
      this.changes.emit(this.paginationData.first);
    }
  }

  goPrevPage(e: any) {
    e.preventDefault();
    this.changes.emit(this.paginationData.prev);
  }

  goToPage(e: any, page: number) {
    e.preventDefault();
    this.changes.emit(page);
  }

  goNextPage(e: any) {
    e.preventDefault();
    this.changes.emit(this.paginationData.next);
  }

  goLastPage(e: any) {
    e.preventDefault();
    this.changes.emit(this.paginationData.last);
  }
  /**
   * When paginationData changes 
   * @param {SimpleChanges} changes 
   * @memberof PaginationComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if(changes['paginationData']) {
      this.updatePaginationShowPage();
    }
  }

  /**
   * Update show pages values
   * @memberof PaginationComponent
   */
  updatePaginationShowPage() {
    let component = this;
    let initPage = 0;
    let step = Math.ceil(component.maxShowPages/2);
    let maxPage = component.paginationData.last ? component.paginationData.last : component.currentPage;
    let tmpMaxShowPage = component.maxShowPages > maxPage ? maxPage : component.maxShowPages;
    if((component.paginationData.last) < (step + component.currentPage)) {
      initPage = maxPage - tmpMaxShowPage;
    } else if(component.currentPage > step) {
      initPage = component.currentPage - step;
    } 
    let tmpShowPages = [];
    for (let index = 1; index <= tmpMaxShowPage; index++) {
      tmpShowPages.push(initPage + index);
    }
    component.showPages = tmpShowPages;
  }
}
