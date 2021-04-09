import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VirtualScrollService {
  scrollY = new BehaviorSubject(0);
  scrollY$ = this.scrollY.asObservable();

  constructor() {}

  updateScrollY(currScrollValue: number): void {
    this.scrollY.next(currScrollValue);
  }

  /*
   * Returns number of a first node that will be rendered.
   * @param number distance that has been scrolled from the top
   * @param number static height of one item
   * @param number top and bottom count of nodes that will be rendered but not shown
   */
  getStartNode(
    scrollTop: number,
    childHeight: number,
    nodePadding: number
  ): number {
    const startNode: number = Math.floor(scrollTop / childHeight) - nodePadding;
    return Math.max(0, startNode);
  }

  /*
   * Returns count of nodes that will be rendered.
   * @param number viewport height
   * @param number static height of one item
   * @param number top and bottom count of nodes that will be rendered but not shown
   * @param number count of items list length
   * @param number number of a first node that will be rendered
   */
  getVisibleNodesCount(
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

  /*
   * Returns height from top of the content to startNode;
   * @param number number of a first node that will be rendered
   * @param number static height of one item
   */
  getOffsetY(startNode: number, childHeight: number): number {
    return startNode * childHeight;
  }
}
