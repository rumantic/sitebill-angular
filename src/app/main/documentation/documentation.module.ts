import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatIconModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';


const routes: Routes = [
    {
        path        : 'my',
        loadChildren: './components-third-party/components-third-party.module#ComponentsThirdPartyModule'
    },
];

@NgModule({
    declarations: [
        
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatIconModule,

        FuseSharedModule
    ]
})
export class DocumentationModule
{
}
