import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { issue } from './issues-list.model';
import { pagination } from '../pagination/pagination.model';

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

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router) {
    let component = this;
    component.route.params.subscribe((params: Params) => {
        component.currentPage = typeof params['numPage'] != 'undefined' ? params['numPage'] : 1;
        this.updateIssuesList(this.currentPage);
    });
  }

  ngOnInit() {
    
  }

  changeState(state) {
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

  paginationChanges(page) {
    this.router.navigate(['/' + page]);
  }

  linksToPaginationData(headerLinks) {
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

  updateIssuesList(page) {
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
        console.log('entro')
        component.errorMessage = err.json().message;
      }
    );
  }
}

