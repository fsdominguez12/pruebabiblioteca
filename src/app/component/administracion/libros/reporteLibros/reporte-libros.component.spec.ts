import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteLibrosComponent } from './reporte-libros.component';

describe('ReporteLibrosComponent', () => {
  let component: ReporteLibrosComponent;
  let fixture: ComponentFixture<ReporteLibrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteLibrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteLibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
