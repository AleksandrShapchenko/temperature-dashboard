import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VirtualScrollService } from '../virtual-scroll.service';
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

  @Input()
  public items: string[];

  @Input()
  public viewportHeight: number;

  @Input()
  public childHeight: number;

  @Input()
  public nodePadding: number;

  @Output()
  public vsUpdate: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor(private virtualScroll: VirtualScrollService) {}

  ngOnInit(): void {
    const itemCount: number = this.items.length;
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

    this.visibleItemList = this.items.slice(0, visibleNodesCount);

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

        this.visibleItemList = this.items.slice(
          startNode,
          startNode + visibleNodesCount
        );
        this.vsUpdate.emit(this.visibleItemList);
      });
  }

  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
