import {Injectable, Output, EventEmitter } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class FilterService {

    // Observable string sources
    private missionAnnouncedSource = new Subject<string>();
    private missionConfirmedSource = new Subject<string>();
    @Output() change: EventEmitter<string> = new EventEmitter();
    isOpen = false;
    toggle(district_list: string) {
        this.isOpen = !this.isOpen;
        console.log('toggle ' + this.isOpen);
        this.change.emit(district_list);
      }

    // Observable string streams
    missionAnnounced$ = this.missionAnnouncedSource.asObservable();
    missionConfirmed$ = this.missionConfirmedSource.asObservable();

    // Service message commands
    announceMission(mission: string) {
        console.log('announceMission' + mission);
        //this.change.emit(mission);

        this.missionAnnouncedSource.next(mission);
    }

    confirmMission(astronaut: string) {
        this.missionConfirmedSource.next(astronaut);
    }
}
