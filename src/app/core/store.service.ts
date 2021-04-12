import { Injectable } from '@angular/core';
import { itemList } from './data/itemList';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private itemList: string[];
  constructor() {
    this.itemList = itemList;
  }

  setItemList(newItemList: string[]): void {
    this.itemList = newItemList;
  }

  getItemList(): string[] {
    if (this.itemList) {
      return this.itemList;
    } else {
      throw new Error('list of items is empty');
    }
  }
}
