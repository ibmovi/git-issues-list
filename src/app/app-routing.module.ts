import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssuesListComponent } from './issues-list/issues-list.component';

const routes: Routes = [
    {
        path: '', component: IssuesListComponent
    },
    {
        path: ':numPage', component: IssuesListComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }