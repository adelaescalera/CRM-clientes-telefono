import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelefonoChartComponent } from './telefono-chart.component';

describe('TelefonoChartComponent', () => {
  let component: TelefonoChartComponent;
  let fixture: ComponentFixture<TelefonoChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelefonoChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelefonoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
