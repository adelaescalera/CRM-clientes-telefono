import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoTableComponent } from './consumo-table.component';

describe('ConsumoTableComponent', () => {
  let component: ConsumoTableComponent;
  let fixture: ComponentFixture<ConsumoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumoTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
