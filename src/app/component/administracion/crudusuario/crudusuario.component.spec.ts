import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudusuarioComponent } from './crudusuario.component';

describe('CrudusuarioComponent', () => {
  let component: CrudusuarioComponent;
  let fixture: ComponentFixture<CrudusuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudusuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudusuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
