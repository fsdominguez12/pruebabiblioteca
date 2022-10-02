import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportevariosComponent } from './reportevarios.component';

describe('ReportevariosComponent', () => {
  let component: ReportevariosComponent;
  let fixture: ComponentFixture<ReportevariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportevariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportevariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
