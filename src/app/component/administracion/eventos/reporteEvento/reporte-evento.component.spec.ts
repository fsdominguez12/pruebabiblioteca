import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEventoComponent } from './reporte-evento.component';

describe('ReporteEventoComponent', () => {
  let component: ReporteEventoComponent;
  let fixture: ComponentFixture<ReporteEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteEventoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
