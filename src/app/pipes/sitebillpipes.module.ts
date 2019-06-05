import { NgModule } from '@angular/core';

import { EscapeHtmlPipe } from './keep-html.pipe';
import {HighlightPipe} from './highlight-pipe';

@NgModule({
    declarations: [
        EscapeHtmlPipe,
        HighlightPipe,
    ],
    imports     : [],
    exports     : [
        EscapeHtmlPipe,
        HighlightPipe,
    ]
})
export class SitebillPipesModule
{
}
