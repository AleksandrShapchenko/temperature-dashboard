import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private itemList?: string[];
  constructor() {}

  setItemList(itemsCount: number): void {
    this.itemList = new Array(itemsCount)
      .fill(null)
      .map((_: null, index: number): string => `Item ${index}`);
  }

  getItemList(): string[] {
    if (this.itemList) {
      return this.itemList;
    } else {
      throw new Error('list of items is empty');
    }
  }
}
