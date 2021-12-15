import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappModalComponent } from './whatsapp-modal.component';

describe('WhatsappModalComponent', () => {
  let component: WhatsappModalComponent;
  let fixture: ComponentFixture<WhatsappModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
