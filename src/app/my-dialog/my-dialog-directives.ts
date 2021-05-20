import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { _closeDialogVia, MyDialogRef } from './my-dialog-ref';
import { MyDialogService } from './my-dialog.service';

@Directive({
  selector: '[my-dialog-close], [myDialogClose]',
  exportAs: 'myDialogClose'
})
export class MyDialogClose implements OnInit, OnChanges {
  @Input('my-dialog-close') dialogResult: any;
  @Input('myDialogClose') _myDialogClose: any;

  constructor(
    @Optional() public dialogRef: MyDialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: MyDialogService
  ) {}

  @HostListener('click', ['$event']) _onClick(event: MouseEvent): any {
    _closeDialogVia(
      this.dialogRef,
      event.screenX === 0 && event.screenY === 0 ? 'keyboard' : 'mouse',
      this.dialogResult
    );
  }

  ngOnInit(): void {
    if (!this.dialogRef) {
      this.dialogRef = getClosestDialog(
        this._elementRef,
        this._dialog.openDialogs
      )!;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const proxiedChange: SimpleChange =
      changes['_matDialogClose'] || changes['_matDialogCloseResult'];

    if (proxiedChange) {
      this.dialogResult = proxiedChange.currentValue;
    }
  }
}

@Directive({
  selector: '[my-dialog-title], [myDialogTitle]',
  exportAs: 'myDialogTitle'
})
export class MyDialogTitle {
  @HostBinding('class') get getMyDialogTitleClass(): string {
    return 'my-dialog-title';
  }
}

@Directive({
  selector: '[my-dialog-content], [myDialogContent]',
  exportAs: 'myDialogContent'
})
export class MyDialogContent {
  @HostBinding('class') get getMyDialogContentClass(): string {
    return 'my-dialog-content';
  }
}

@Directive({
  selector: '[my-dialog-actions], [myDialogActions]',
  exportAs: 'myDialogActions'
})
export class MyDialogActions {
  @HostBinding('class') get getMyDialogActionsClass(): string {
    return 'my-dialog-actions';
  }
}

function getClosestDialog(
  element: ElementRef<HTMLElement>,
  openDialogs: MyDialogRef<any>[]
): MyDialogRef<any> | null {
  let parent: HTMLElement | null = element.nativeElement.parentElement;

  while (parent && !parent.classList.contains('mat-dialog-container')) {
    parent = parent.parentElement;
  }

  return parent
    ? openDialogs.find(
        (dialog: MyDialogRef<any>): boolean => dialog.id === parent!.id
      )!
    : null;
}
