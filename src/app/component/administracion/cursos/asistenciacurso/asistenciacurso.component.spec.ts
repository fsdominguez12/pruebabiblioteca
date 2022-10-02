import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciacursoComponent } from './asistenciacurso.component';

describe('AsistenciacursoComponent', () => {
  let component: AsistenciacursoComponent;
  let fixture: ComponentFixture<AsistenciacursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsistenciacursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciacursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
