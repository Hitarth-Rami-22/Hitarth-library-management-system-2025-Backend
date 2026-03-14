import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastContainerComponent } from './toast-container/toast-container.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [
    ToastContainerComponent,
    ToastComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ToastContainerComponent
  ]
})
export class ToastModule { }
