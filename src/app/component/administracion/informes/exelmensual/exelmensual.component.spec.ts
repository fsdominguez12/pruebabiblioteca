import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExelmensualComponent } from './exelmensual.component';

describe('ExelmensualComponent', () => {
  let component: ExelmensualComponent;
  let fixture: ComponentFixture<ExelmensualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExelmensualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExelmensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
