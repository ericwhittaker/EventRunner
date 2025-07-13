import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRelatedApps } from './action-related-apps';

describe('ActionRelatedApps', () => {
  let component: ActionRelatedApps;
  let fixture: ComponentFixture<ActionRelatedApps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionRelatedApps]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionRelatedApps);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
