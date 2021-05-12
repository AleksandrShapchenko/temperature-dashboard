import { Injectable } from '@angular/core';

@Injectable()
export class ModalDialogService {
  private openedModalCount = 0;
  constructor() {}

  public getOpenedModalCount(): number {
    return this.openedModalCount;
  }

  public incrementOpenedModalCount(): void {
    this.openedModalCount++;
  }

  public decrementOpenedModalCount(): void {
    this.openedModalCount--;
  }
}
