import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderVehicalComponent } from './order-vehical.component';

describe('OrderVehicalComponent', () => {
  let component: OrderVehicalComponent;
  let fixture: ComponentFixture<OrderVehicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderVehicalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderVehicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
