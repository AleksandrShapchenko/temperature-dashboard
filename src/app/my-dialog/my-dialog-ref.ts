import { FocusOrigin } from '@angular/cdk/a11y';
import { GlobalPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DialogPosition } from './my-dialog-config';
import { DialogAnimationEvent, MyDialogContainer } from './my-dialog-container';

let uniqueId: number = 0;

export const enum MyDialogState {
  OPEN,
  CLOSING,
  CLOSED
}

export class MyDialogRef<T, R = any> {
  componentInstance: T;

  private readonly _afterOpened = new Subject<void>();

  private readonly _afterClosed = new Subject<R | undefined>();

  private readonly _beforeClosed = new Subject<R | undefined>();

  private _result: R | undefined;

  private _closeFallbackTimeout: ReturnType<typeof setTimeout>;

  private _state = MyDialogState.OPEN;

  constructor(
    private _overlayRef: OverlayRef,
    public _containerInstance: MyDialogContainer,
    readonly id: string = `mat-dialog-${uniqueId++}`
  ) {
    _containerInstance._id = id;

    _containerInstance._animationStateChanged
      .pipe(
        filter(
          (event: DialogAnimationEvent): boolean => event.state === 'opened'
        ),
        take(1)
      )
      .subscribe((): void => {
        this._afterOpened.next();
        this._afterOpened.complete();
      });

    _containerInstance._animationStateChanged
      .pipe(
        filter(
          (event: DialogAnimationEvent): boolean => event.state === 'closed'
        ),
        take(1)
      )
      .subscribe((): void => {
        clearTimeout(this._closeFallbackTimeout);
        this._finishDialogClose();
      });

    _overlayRef.detachments().subscribe((): void => {
      this._beforeClosed.next(this._result);
      this._beforeClosed.complete();
      this._afterClosed.next(this._result);
      this._afterClosed.complete();
      this.componentInstance = null!;
      this._overlayRef.dispose();
    });

    _overlayRef
      .keydownEvents()
      .pipe(
        filter((event: KeyboardEvent): boolean => {
          return event.code === 'Escape';
        })
      )
      .subscribe((event: KeyboardEvent): void => {
        event.preventDefault();
        _closeDialogVia(this, 'keyboard');
      });

    _overlayRef.backdropClick().subscribe((): void => {
      _closeDialogVia(this, 'mouse');
    });
  }

  close(dialogResult?: R): void {
    this._result = dialogResult;

    this._containerInstance._animationStateChanged
      .pipe(
        filter(
          (event: DialogAnimationEvent): boolean => event.state === 'closing'
        ),
        take(1)
      )
      .subscribe((event: DialogAnimationEvent): void => {
        this._beforeClosed.next(dialogResult);
        this._beforeClosed.complete();
        this._overlayRef.detachBackdrop();

        this._closeFallbackTimeout = setTimeout(
          (): void => this._finishDialogClose(),
          event.totalTime + 100
        );
      });

    this._state = MyDialogState.CLOSING;
    this._containerInstance._startExitAnimation();
  }

  afterOpened(): Observable<void> {
    return this._afterOpened;
  }

  afterClosed(): Observable<R | undefined> {
    return this._afterClosed;
  }

  keydownEvents(): Observable<KeyboardEvent> {
    return this._overlayRef.keydownEvents();
  }

  updatePosition(position?: DialogPosition): this {
    const strategy: GlobalPositionStrategy = this._getPositionStrategy();

    if (position && (position.left || position.right)) {
      position.left
        ? strategy.left(position.left)
        : strategy.right(position.right);
    } else {
      strategy.centerHorizontally();
    }

    if (position && (position.top || position.bottom)) {
      position.top
        ? strategy.top(position.top)
        : strategy.bottom(position.bottom);
    } else {
      strategy.centerVertically();
    }

    this._overlayRef.updatePosition();

    return this;
  }

  updateSize(width: string = '', height: string = ''): this {
    this._overlayRef.updateSize({ width, height });
    this._overlayRef.updatePosition();
    return this;
  }

  getState(): MyDialogState {
    return this._state;
  }

  private _finishDialogClose(): void {
    this._state = MyDialogState.CLOSED;
    this._overlayRef.dispose();
  }

  private _getPositionStrategy(): GlobalPositionStrategy {
    return this._overlayRef.getConfig()
      .positionStrategy as GlobalPositionStrategy;
  }
}

export function _closeDialogVia<R>(
  ref: MyDialogRef<R>,
  interactionType: FocusOrigin,
  result?: R
): void {
  return ref.close(result);
}
