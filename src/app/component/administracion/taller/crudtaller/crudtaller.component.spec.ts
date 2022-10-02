import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudtallerComponent } from './crudtaller.component';

describe('CrudtallerComponent', () => {
  let component: CrudtallerComponent;
  let fixture: ComponentFixture<CrudtallerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudtallerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudtallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
