import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { GridComponent } from './grid.component';

const routes = [
    {
        path     : '**',
        component: GridComponent
    }
];

@NgModule({
    declarations: [
        GridComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule
    ]
})

export class GridModule
{
}
