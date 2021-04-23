import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../core/store.service';

@Component({
  selector: 'app-scrolling',
  templateUrl: './scrolling.component.html',
  styleUrls: ['./scrolling.component.less']
})
export class ScrollingComponent implements OnInit {
  public items: string[];
  constructor(private store: StoreService) {
    this.items = store.getItemList();
  }

  ngOnInit(): void {}
}
