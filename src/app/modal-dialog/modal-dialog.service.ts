import { Injectable } from '@angular/core';

@Injectable()
export class ModalDialogService {
  private modals: any[] = [];

  constructor() {}

  public addToOpened(modal: any): void {
    this.modals.push(modal);
  }

  public removeFromOpened(id: string): void {
    this.modals = this.modals.filter((modal: any): boolean => modal.id !== id);
  }

  public open(id: string): void {
    const modal: any = this.modals.find((m: any): boolean => m.id === id);
    modal.open();
  }

  public close(id: string): void {
    const modal: any = this.modals.find((m: any): boolean => m.id === id);
    modal.close();
  }
}
