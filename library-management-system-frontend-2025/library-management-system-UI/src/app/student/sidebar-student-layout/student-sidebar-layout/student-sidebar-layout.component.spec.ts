import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSidebarLayoutComponent } from './student-sidebar-layout.component';

describe('StudentSidebarLayoutComponent', () => {
  let component: StudentSidebarLayoutComponent;
  let fixture: ComponentFixture<StudentSidebarLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentSidebarLayoutComponent]
    });
    fixture = TestBed.createComponent(StudentSidebarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
