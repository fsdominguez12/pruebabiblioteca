import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaTallerComponent } from './asistencia-taller.component';

describe('AsistenciaTallerComponent', () => {
  let component: AsistenciaTallerComponent;
  let fixture: ComponentFixture<AsistenciaTallerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsistenciaTallerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciaTallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
