import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatnerDeatailsComponent } from './patner-deatails.component';

describe('PatnerDeatailsComponent', () => {
  let component: PatnerDeatailsComponent;
  let fixture: ComponentFixture<PatnerDeatailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatnerDeatailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatnerDeatailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
