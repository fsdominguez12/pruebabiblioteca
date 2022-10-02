import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudcomputoComponent } from './crudcomputo.component';

describe('CrudcomputoComponent', () => {
  let component: CrudcomputoComponent;
  let fixture: ComponentFixture<CrudcomputoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudcomputoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudcomputoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
