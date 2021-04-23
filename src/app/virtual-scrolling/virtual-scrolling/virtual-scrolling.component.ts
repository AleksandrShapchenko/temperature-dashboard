import { Component, Input, OnInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-virtual-scrolling',
  templateUrl: './virtual-scrolling.component.html',
  styleUrls: ['./virtual-scrolling.component.less']
})
export class VirtualScrollingComponent implements OnInit {
  public offsetY: number;
  public totalHeight: number;
  public visibleItemList: string[];

  private destroy = new Subject();
  private destroy$ = this.destroy.asObservable();

  @Input() public items: string[];
  @Input() public viewportHeight: number;
  @Input() public childHeight: number;
  @Input() public nodePadding: number;

  constructor() {}

  ngOnInit(): void {
    const itemCount: number = this.items.length;
    const viewport: Element | null = document.getElementById('viewport');
    const getVisibleNodesCountByStartNode: (startNode: number) => number = (
      startNode: number
    ): number => {
      return this.getVisibleNodesCount(
        this.viewportHeight,
        this.childHeight,
        this.nodePadding,
        itemCount,
        startNode
      );
    };

    let visibleNodesCount: number = getVisibleNodesCountByStartNode(0);
    this.totalHeight = itemCount * this.childHeight;

    this.visibleItemList = this.items.slice(0, visibleNodesCount);

    fromEvent(viewport as FromEventTarget<Event>, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: Event): void => {
        const scrollY: number = this.getYPosition(e);

        const startNode: number = this.getStartNode(
          scrollY,
          this.childHeight,
          this.nodePadding
        );

        visibleNodesCount = getVisibleNodesCountByStartNode(startNode);

        this.offsetY = this.getOffsetY(startNode, this.childHeight);

        this.visibleItemList = this.items.slice(
          startNode,
          startNode + visibleNodesCount
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }

  // Returns scrollTop
  protected getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }

  // Returns number of a first node that will be rendered.
  protected getStartNode(
    scrollTop: number,
    childHeight: number,
    nodePadding: number
  ): number {
    const startNode: number = Math.floor(scrollTop / childHeight) - nodePadding;
    return Math.max(0, startNode);
  }

  // Returns count of nodes that will be rendered.
  protected getVisibleNodesCount(
    viewportHeight: number,
    childHeight: number,
    nodePadding: number,
    itemCount: number,
    startNode: number
  ): number {
    const visibleNodesCount: number =
      Math.ceil(viewportHeight / childHeight) + 2 * nodePadding;
    return Math.min(itemCount - startNode, visibleNodesCount);
  }

  // Returns height from top of the content to startNode;
  protected getOffsetY(startNode: number, childHeight: number): number {
    return startNode * childHeight;
  }
}
