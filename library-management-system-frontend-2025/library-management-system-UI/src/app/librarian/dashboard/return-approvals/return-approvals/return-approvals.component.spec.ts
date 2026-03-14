import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnApprovalsComponent } from './return-approvals.component';

describe('ReturnApprovalsComponent', () => {
  let component: ReturnApprovalsComponent;
  let fixture: ComponentFixture<ReturnApprovalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnApprovalsComponent]
    });
    fixture = TestBed.createComponent(ReturnApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
