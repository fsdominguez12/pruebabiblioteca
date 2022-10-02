import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudeventoComponent } from './crudevento.component';

describe('CrudeventoComponent', () => {
  let component: CrudeventoComponent;
  let fixture: ComponentFixture<CrudeventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudeventoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudeventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
