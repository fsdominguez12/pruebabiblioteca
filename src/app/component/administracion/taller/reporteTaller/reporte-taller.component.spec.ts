import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTallerComponent } from './reporte-taller.component';

describe('ReporteTallerComponent', () => {
  let component: ReporteTallerComponent;
  let fixture: ComponentFixture<ReporteTallerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteTallerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteTallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
