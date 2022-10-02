import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteImpresionCopiasComponent } from './reporte-impresion-copias.component';

describe('ReporteImpresionCopiasComponent', () => {
  let component: ReporteImpresionCopiasComponent;
  let fixture: ComponentFixture<ReporteImpresionCopiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteImpresionCopiasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteImpresionCopiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
