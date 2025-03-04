import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDetailsComponent } from './vendor-details.component';

describe('VendorDetailsComponent', () => {
  let component: VendorDetailsComponent;
  let fixture: ComponentFixture<VendorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
