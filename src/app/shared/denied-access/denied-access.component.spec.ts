import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeniedAccessComponent } from './denied-access.component';

describe('DeniedAccessComponent', () => {
  let component: DeniedAccessComponent;
  let fixture: ComponentFixture<DeniedAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeniedAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeniedAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
