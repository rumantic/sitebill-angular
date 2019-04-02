import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replace',
})

export class ReplacePipe implements PipeTransform {
    transform(value: string, term: string): string {
        if (value == undefined) {
            return '';
        }
        value = '<span class="highlight" style="color: green;">' + term + '</span> ' + value;
        return value;
    }
}
