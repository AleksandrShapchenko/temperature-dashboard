import { Injectable } from '@angular/core';
import { ModalDialogModule } from './modal-dialog.module';

@Injectable({
  providedIn: ModalDialogModule
})
export class ModalDialogService {
  private modals: any[] = [];

  constructor() {}

  protected addToOpened(modal: any): void {
    this.modals.push(modal);
  }

  protected removeFromOpened(id: string): void {
    this.modals = this.modals.filter((modal: any): boolean => modal.id !== id);
  }

  protected open(id: string): void {
    const modal: any = this.modals.find((m: any): boolean => m.id === id);
    modal.open();
  }

  protected close(id: string): void {
    const modal: any = this.modals.find((m: any): boolean => m.id === id);
    modal.close();
  }
}
