import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllVehicalsComponent } from './all-vehicals.component';

describe('AllVehicalsComponent', () => {
  let component: AllVehicalsComponent;
  let fixture: ComponentFixture<AllVehicalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllVehicalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllVehicalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
