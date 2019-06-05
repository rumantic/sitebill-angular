import { NgModule } from '@angular/core';

import { EscapeHtmlPipe } from './keep-html.pipe';
import {HighlightPipe} from './highlight-pipe';
import {ReplacePipe} from './replace.pipe';

@NgModule({
    declarations: [
        EscapeHtmlPipe,
        HighlightPipe,
        ReplacePipe
    ],
    imports     : [],
    exports     : [
        EscapeHtmlPipe,
        HighlightPipe,
        ReplacePipe
    ]
})
export class SitebillPipesModule
{
}
