import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTallerComponent } from './editar-taller.component';

describe('EditarTallerComponent', () => {
  let component: EditarTallerComponent;
  let fixture: ComponentFixture<EditarTallerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarTallerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarTallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
