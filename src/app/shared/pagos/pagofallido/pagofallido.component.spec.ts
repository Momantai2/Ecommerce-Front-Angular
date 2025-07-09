import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagofallidoComponent } from './pagofallido.component';

describe('PagofallidoComponent', () => {
  let component: PagofallidoComponent;
  let fixture: ComponentFixture<PagofallidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagofallidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagofallidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
