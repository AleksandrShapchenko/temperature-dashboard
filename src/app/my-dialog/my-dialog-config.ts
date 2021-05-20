import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

export interface DialogPosition {
  top?: 'string';
  right?: 'string';
  bottom?: 'string';
  left?: 'string';
}

export class MyDialogConfig<D = any> {
  viewContainerRef?: ViewContainerRef;

  id?: string;

  panelClass?: string | string[] = '';

  hasBackdrop?: boolean = true;

  backdropClass?: string | string[] = '';

  disableClose?: boolean = false;

  width?: string = '';

  height?: string = '';

  minWidth?: number | string;

  minHeight?: number | string;

  maxWidth?: number | string = '80vw';

  maxHeight?: number | string;

  position?: DialogPosition;

  data?: D | null = null;

  autoFocus?: boolean = true;

  componentFactoryResolver?: ComponentFactoryResolver;
}
