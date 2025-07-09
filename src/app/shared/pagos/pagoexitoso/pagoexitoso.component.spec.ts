import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoexitosoComponent } from './pagoexitoso.component';

describe('PagoexitosoComponent', () => {
  let component: PagoexitosoComponent;
  let fixture: ComponentFixture<PagoexitosoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoexitosoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoexitosoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
