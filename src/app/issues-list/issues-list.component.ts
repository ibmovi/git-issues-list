import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { issue } from './issues-list.model';
import { pagination } from '../pagination/pagination.model';
/**
 * List git hub issues component
 * @export
 * @class IssuesListComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.css']
})
export class IssuesListComponent implements OnInit {
  private gitIssuesUrl: string = 'https://api.github.com/repos/angular/angular/issues?per_page=15';
  private gitIssuesState: string = 'open';
  
  issuesList: Array<issue> = [];
  stateOpen: boolean = true;
  stateClosed: boolean = false;
  errorMessage: string = '';

  paginationData: pagination = {
    first: null,
    next: null,
    prev: null,
    last: null
  };
  currentPage: number = 1;

  /**
   * Creates an instance of IssuesListComponent.
   * @param {Http} http 
   * @param {ActivatedRoute} route 
   * @param {Router} router 
   * @memberof IssuesListComponent
   */
  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router) {
    let component = this;
    component.route.params.subscribe((params: Params) => {
        component.currentPage = typeof params['numPage'] != 'undefined' ? +params['numPage'] : 1;
        this.updateIssuesList(this.currentPage);
    });
  }

  ngOnInit() {
    
  }
  /**
   * Change the list of "issues" by state
   * @param {any} state open or closed
   * @memberof IssuesListComponent
   */
  changeState(state: string) {
      if(this.stateOpen && this.stateClosed) {
        this.gitIssuesState = 'all';
      } else if(this.stateClosed) {
        this.gitIssuesState = 'closed'
      } else {
        this.stateOpen = true;
        this.gitIssuesState = 'open';
      }
      this.updateIssuesList(1);
    }

  /**
   * @param {number} page Page number to navigate 
   * @memberof IssuesListComponent
   */
  paginationChanges(page: number) {
    this.router.navigate(['/' + page]);
  }

  /**
   * Response header links parser, to update paginationData
   * Links example:
   * "<https://api.github.com/repositories/24195339/issues?per_page=15&state=open&page=4>;" rel="next", 
   * @param {string} headerLinks Response header links
   * @memberof IssuesListComponent
   */
  linksToPaginationData(headerLinks: string) {
    let component = this;
    let tmpPaginationData: pagination = {
      first: null,
      next: null,
      prev: null,
      last: null
    };
    let links = headerLinks.split(',');

    links.forEach(link => {
      let matchGroups = link.match(/[&|?]page=(\d*).+rel="(\w*)"/);
      if (matchGroups) tmpPaginationData[matchGroups[2]] = Number(matchGroups[1]);
    });
    component.paginationData = tmpPaginationData;
  }

  /**
   * Update issues list with the http request
   * @param {number} page Page number to get issues 
   * @memberof IssuesListComponent
   */
  updateIssuesList(page: number) {
    let component = this;
    component.http.get(component.gitIssuesUrl + '&state=' + component.gitIssuesState + '&page=' + page).subscribe(
      res => {
        if (res.status == 200) {
          component.errorMessage = '';
          component.currentPage = page;
          let headerLinks: string = res.headers.get('link');
          if (headerLinks) {
            component.linksToPaginationData(headerLinks);
          }
          component.issuesList = res.json();
        } else {
          component.errorMessage = res.json().message;
        }
      },
      err => {
        component.errorMessage = err.json().message;
      }
    );
  }
}

