import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardresumenComponent } from './dashboardresumen.component';

describe('DashboardresumenComponent', () => {
  let component: DashboardresumenComponent;
  let fixture: ComponentFixture<DashboardresumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardresumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardresumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
