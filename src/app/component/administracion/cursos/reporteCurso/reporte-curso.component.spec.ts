import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCursoComponent } from './reporte-curso.component';

describe('ReporteCursoComponent', () => {
  let component: ReporteCursoComponent;
  let fixture: ComponentFixture<ReporteCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
