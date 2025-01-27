import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicalrequestComponent } from './vehicalrequest.component';

describe('VehicalrequestComponent', () => {
  let component: VehicalrequestComponent;
  let fixture: ComponentFixture<VehicalrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicalrequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicalrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
