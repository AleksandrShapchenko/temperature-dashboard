import { AnimationEvent } from '@angular/animations';
import {
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter, Inject, Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  DomPortal,
  TemplatePortal
} from '@angular/cdk/portal';
import { myDialogAnimations } from './my-dialog-animations';
import { ConfigurableFocusTrapFactory, FocusTrap } from '@angular/cdk/a11y';
import { MyDialogConfig } from './my-dialog-config';
import { DOCUMENT } from '@angular/common';

export function throwMyDialogContentAttachedError(): void {
  throw Error('Dialog content is already attached');
}

export interface DialogAnimationEvent {
  state: 'opened' | 'opening' | 'closed' | 'closing';
  totalTime: number;
}

@Component({
  selector: 'my-dialog-container',
  templateUrl: './my-dialog-container.html',
  styleUrls: ['./my-dialog.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [myDialogAnimations.myDialogContainer],
  host: {
    class: 'my-dialog-container',
    '[@myDialogContainer]': '_state',
    '(@myDialogContainer.start)': '_onAnimationStart($event)',
    '(@myDialogContainer.done)': '_onAnimationDone($event)'
  }
})
export class MyDialogContainer extends BasePortalOutlet {
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  private _focusTrap: FocusTrap;
  protected _document: HTMLDocument;
  _id: string;
  _state: 'void' | 'enter' | 'exit' = 'enter';
  _animationStateChanged = new EventEmitter<DialogAnimationEvent>();

  constructor(
    protected _elementRef: ElementRef,
    protected _focusTrapFactory: ConfigurableFocusTrapFactory,
    public _config: MyDialogConfig,
    @Optional() @Inject(DOCUMENT) _document: any
  ) {
    super();
    this._document = _document;
  }

  _initializeWithAttachedContent(): void {
    this._setupFocusTrap();
    this._focusDialogContainer();
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached()) {
      throwMyDialogContentAttachedError();
    }

    return this._portalOutlet.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throwMyDialogContentAttachedError();
    }

    return this._portalOutlet.attachTemplatePortal(portal);
  }

  attachDomPortal = (portal: DomPortal): any => {
    if (this._portalOutlet.hasAttached()) {
      throwMyDialogContentAttachedError();
    }

    return this._portalOutlet.attachDomPortal(portal);
  };

  _onAnimationDone({ toState, totalTime }: AnimationEvent): void {
    if (toState === 'enter') {
      this._trapFocus();
      this._animationStateChanged.next({ state: 'opened', totalTime });
    } else if (toState === 'exit') {
      this._animationStateChanged.next({ state: 'closed', totalTime });
    }
  }

  _onAnimationStart({ toState, totalTime }: AnimationEvent): void {
    if (toState === 'enter') {
      this._animationStateChanged.next({ state: 'opening', totalTime });
    } else if (toState === 'exit' || toState === 'void') {
      this._animationStateChanged.next({ state: 'closing', totalTime });
    }
  }

  protected _trapFocus(): void {
    if (this._config.autoFocus) {
      this._focusTrap.focusInitialElementWhenReady();
    } else if (!this._containsFocus()) {
      this._elementRef.nativeElement.focus();
    }
  }

  private _containsFocus(): any {
    const element: Element = this._elementRef.nativeElement;
    const activeElement: Element | null = this._getActiveElement();
    return element === activeElement || element.contains(activeElement);
  }

  private _getActiveElement(): Element | null {
    const activeElement: Element | null = this._document.activeElement;
    return activeElement?.shadowRoot?.activeElement as HTMLElement || activeElement;
  }

  private _focusDialogContainer(): void {
    this._elementRef.nativeElement.focus();
  }

  private _setupFocusTrap(): void {
    this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
  }

  _startExitAnimation(): void {
    this._state = 'exit';
  }
}
