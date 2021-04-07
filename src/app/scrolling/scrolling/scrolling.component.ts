import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scrolling',
  templateUrl: './scrolling.component.html',
  styleUrls: ['./scrolling.component.less']
})
export class ScrollingComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onContainerScroll(e: Event): void {
    console.log(e);
  }
}
