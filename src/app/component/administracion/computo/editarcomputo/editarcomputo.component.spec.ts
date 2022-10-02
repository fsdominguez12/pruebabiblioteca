import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarcomputoComponent } from './editarcomputo.component';

describe('EditarcomputoComponent', () => {
  let component: EditarcomputoComponent;
  let fixture: ComponentFixture<EditarcomputoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarcomputoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarcomputoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
