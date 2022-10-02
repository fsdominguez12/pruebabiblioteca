import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteComputoComponent } from './reporte-computo.component';

describe('ReporteComputoComponent', () => {
  let component: ReporteComputoComponent;
  let fixture: ComponentFixture<ReporteComputoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteComputoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteComputoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
