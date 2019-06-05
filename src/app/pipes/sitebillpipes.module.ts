import { NgModule } from '@angular/core';

import { EscapeHtmlPipe } from './keep-html.pipe';

@NgModule({
    declarations: [
        EscapeHtmlPipe,
    ],
    imports     : [],
    exports     : [
        EscapeHtmlPipe,
    ]
})
export class SitebillPipesModule
{
}
