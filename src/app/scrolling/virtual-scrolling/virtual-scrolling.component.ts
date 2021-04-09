import { Component, Input, OnInit } from '@angular/core';
import { VirtualScrollService } from '../../core/virtual-scroll.service';
import { StoreService } from '../../core/store.service';
import { fromEvent, Subject } from 'rxjs';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-virtual-scrolling',
  templateUrl: './virtual-scrolling.component.html',
  styleUrls: ['./virtual-scrolling.component.less']
})
export class VirtualScrollingComponent implements OnInit {
  offsetY: number;
  totalHeight: number;
  visibleItemList: string[];

  destroy = new Subject();
  destroy$ = this.destroy.asObservable();

  @Input() viewportHeight: number;
  @Input() childHeight: number;
  @Input() nodePadding: number;

  constructor(
    private virtualScroll: VirtualScrollService,
    private store: StoreService
  ) {}

  ngOnInit(): void {
    const itemCount: number = 100000;
    const viewport: Element | null = document.getElementById('viewport');
    const getVisibleNodesCount: (startNode: number) => number = (
      startNode: number
    ): number => {
      return this.virtualScroll.getVisibleNodesCount(
        this.viewportHeight,
        this.childHeight,
        this.nodePadding,
        itemCount,
        startNode
      );
    };

    let visibleNodesCount: number = getVisibleNodesCount(0);
    this.totalHeight = itemCount * this.childHeight;

    this.store.setItemList(itemCount);
    this.visibleItemList = this.store.getItemList().slice(0, visibleNodesCount);

    fromEvent(viewport as FromEventTarget<Event>, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: Event): void => {
        this.virtualScroll.scrollY.next(this.getYPosition(e));
        const scrollY: number = this.virtualScroll.scrollY.value;

        const startNode: number = this.virtualScroll.getStartNode(
          scrollY,
          this.childHeight,
          this.nodePadding
        );

        visibleNodesCount = getVisibleNodesCount(startNode);

        this.offsetY = this.virtualScroll.getOffsetY(
          startNode,
          this.childHeight
        );

        this.visibleItemList = this.store
          .getItemList()
          .slice(startNode, startNode + visibleNodesCount);
      });
  }

  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
