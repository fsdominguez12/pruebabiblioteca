import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudcursoComponent } from './crudcurso.component';

describe('CrudcursoComponent', () => {
  let component: CrudcursoComponent;
  let fixture: ComponentFixture<CrudcursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudcursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudcursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
