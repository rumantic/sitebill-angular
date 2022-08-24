import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalComponent } from './interval.component';

xdescribe('IntervalComponent', () => {
  let component: IntervalComponent;
  let fixture: ComponentFixture<IntervalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntervalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});