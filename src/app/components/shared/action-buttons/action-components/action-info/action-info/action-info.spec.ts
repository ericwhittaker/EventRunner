import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionInfo } from './action-info';

describe('ActionInfo', () => {
  let component: ActionInfo;
  let fixture: ComponentFixture<ActionInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
