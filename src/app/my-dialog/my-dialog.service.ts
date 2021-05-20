import {
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayRef
} from '@angular/cdk/overlay';
import {
  ComponentPortal,
  ComponentType,
  TemplatePortal
} from '@angular/cdk/portal';
import {
  ComponentRef,
  Directive,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  Optional,
  SkipSelf,
  StaticProvider,
  TemplateRef,
  Type
} from '@angular/core';
import { defer, Observable, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { MyDialogConfig } from './my-dialog-config';
import { MyDialogContainer } from './my-dialog-container';
import { MyDialogRef } from './my-dialog-ref';

export const MY_DIALOG_DATA: InjectionToken<any> = new InjectionToken<any>(
  'MyDialogData'
);

export const MY_DIALOG_DEFAULT_OPTIONS: InjectionToken<MyDialogConfig> = new InjectionToken<MyDialogConfig>(
  'mat-dialog-default-options'
);

@Directive()
export class MyDialogServiceBase<C extends MyDialogContainer>
  implements OnDestroy {
  readonly afterAllClosed: Observable<void> = defer(
    (): Observable<any> =>
      this.openDialogs.length
        ? this._getAfterAllClosed()
        : this._getAfterAllClosed().pipe(startWith(undefined))
  ) as Observable<any>;
  private _openDialogsAtThisLevel: MyDialogRef<any>[] = [];
  private readonly _afterAllClosedAtThisLevel = new Subject<void>();
  private readonly _afterOpenedAtThisLevel = new Subject<MyDialogRef<any>>();

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    private _defaultOptions: MyDialogConfig | undefined,
    private _parentDialog: MyDialogServiceBase<C> | undefined,
    private _overlayContainer: OverlayContainer,
    private _dialogRefConstructor: Type<MyDialogRef<any>>,
    private _dialogContainerType: Type<C>,
    private _dialogDataToken: InjectionToken<any>
  ) {}

  get openDialogs(): MyDialogRef<any>[] {
    return this._parentDialog
      ? this._parentDialog.openDialogs
      : this._openDialogsAtThisLevel;
  }

  get afterOpened(): Subject<MyDialogRef<any>> {
    return this._parentDialog
      ? this._parentDialog.afterOpened
      : this._afterOpenedAtThisLevel;
  }

  _getAfterAllClosed(): Subject<void> {
    const parent: MyDialogService | undefined = this._parentDialog;
    return parent
      ? parent._getAfterAllClosed()
      : this._afterAllClosedAtThisLevel;
  }

  open<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: MyDialogConfig<D>
  ): MyDialogRef<T, R> {
    config = _applyConfigDefaults(
      config,
      this._defaultOptions || new MyDialogConfig()
    );

    if (config.id && this.getDialogById(config.id)) {
      throw Error(
        `Dialog with id "${config.id}" exists already. The dialog id must be unique.`
      );
    }

    const overlayRef: OverlayRef = this._createOverlay(config);
    const dialogContainer: MyDialogContainer = this._attachDialogContainer(
      overlayRef,
      config
    );
    const dialogRef: MyDialogRef<any> = this._attachDialogContent<T, R>(
      componentOrTemplateRef,
      dialogContainer,
      overlayRef,
      config
    );

    this.openDialogs.push(dialogRef);
    dialogRef
      .afterClosed()
      .subscribe((): void => this._removeOpenDialog(dialogRef));
    this.afterOpened.next(dialogRef);

    dialogContainer._initializeWithAttachedContent();

    return dialogRef;
  }

  closeAll(): void {
    this._closeDialogs(this.openDialogs);
  }

  getDialogById(id: string): MyDialogRef<any> | undefined {
    return this.openDialogs.find(
      (dialog: MyDialogRef<any>): boolean => dialog.id === id
    );
  }

  ngOnDestroy(): void {
    this._closeDialogs(this._openDialogsAtThisLevel);
    this._afterAllClosedAtThisLevel.complete();
    this._afterOpenedAtThisLevel.complete();
  }

  private _createOverlay(config: MyDialogConfig): OverlayRef {
    const overlayConfig: OverlayConfig = this._getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }

  private _getOverlayConfig(dialogConfig: MyDialogConfig): OverlayConfig {
    const state: OverlayConfig = new OverlayConfig({
      positionStrategy: this._overlay.position().global(),
      panelClass: dialogConfig.panelClass,
      hasBackdrop: dialogConfig.hasBackdrop,
      minWidth: dialogConfig.minWidth,
      minHeight: dialogConfig.minHeight,
      maxWidth: dialogConfig.maxWidth,
      maxHeight: dialogConfig.maxHeight
    });

    if (dialogConfig.backdropClass) {
      state.backdropClass = dialogConfig.backdropClass;
    }

    return state;
  }

  private _attachDialogContainer(
    overlay: OverlayRef,
    config: MyDialogConfig
  ): MyDialogContainer {
    const userInjector: Injector | undefined =
      config && config.viewContainerRef && config.viewContainerRef.injector;
    const injector: Injector = Injector.create({
      parent: userInjector || this._injector,
      providers: [{ provide: MyDialogConfig, useValue: config }]
    });

    const containerPortal: ComponentPortal<any> = new ComponentPortal(
      this._dialogContainerType,
      config.viewContainerRef,
      injector,
      config.componentFactoryResolver
    );
    const containerRef: ComponentRef<MyDialogContainer> = overlay.attach<MyDialogContainer>(
      containerPortal
    );

    return containerRef.instance;
  }

  private _attachDialogContent<T, R>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    dialogContainer: MyDialogContainer,
    overlayRef: OverlayRef,
    config: MyDialogConfig
  ): MyDialogRef<T, R> {
    const dialogRef: MyDialogRef<any> = new this._dialogRefConstructor(
      overlayRef,
      dialogContainer,
      config.id
    );

    if (componentOrTemplateRef instanceof TemplateRef) {
      dialogContainer.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplateRef, null!, {
          $implicit: config.data,
          dialogRef
        } as any)
      );
    } else {
      const injector: Injector = this._createInjector<T>(
        config,
        dialogRef,
        dialogContainer
      );
      const contentRef: ComponentRef<T> = dialogContainer.attachComponentPortal<T>(
        new ComponentPortal(
          componentOrTemplateRef,
          config.viewContainerRef,
          injector
        )
      );
      dialogRef.componentInstance = contentRef.instance;
    }

    dialogRef
      .updateSize(config.width, config.height)
      .updatePosition(config.position);

    return dialogRef;
  }

  private _createInjector<T>(
    config: MyDialogConfig,
    dialogRef: MyDialogRef<T>,
    dialogContainer: MyDialogContainer
  ): Injector {
    const userInjector: Injector | undefined =
      config && config.viewContainerRef && config.viewContainerRef.injector;

    const providers: StaticProvider[] = [
      { provide: this._dialogContainerType, useValue: dialogContainer },
      { provide: this._dialogDataToken, useValue: config.data },
      { provide: this._dialogRefConstructor, useValue: dialogRef }
    ];

    return Injector.create({
      parent: userInjector || this._injector,
      providers
    });
  }

  private _removeOpenDialog(dialogRef: MyDialogRef<any>): void {
    const index: number = this.openDialogs.indexOf(dialogRef);

    if (index > -1) {
      this.openDialogs.splice(index, 1);
      this._getAfterAllClosed().next();
    }
  }

  private _closeDialogs(dialogs: MyDialogRef<any>[]): void {
    let i: number = dialogs.length;

    while (i--) {
      dialogs[i].close();
    }
  }
}

@Injectable()
export class MyDialogService extends MyDialogServiceBase<MyDialogContainer> {
  constructor(
    overlay: Overlay,
    injector: Injector,
    @Optional()
    @Inject(MY_DIALOG_DEFAULT_OPTIONS)
    defaultOptions: MyDialogConfig,
    @Optional() @SkipSelf() parentDialog: MyDialogService,
    overlayContainer: OverlayContainer
  ) {
    super(
      overlay,
      injector,
      defaultOptions,
      parentDialog,
      overlayContainer,
      MyDialogRef,
      MyDialogContainer,
      MY_DIALOG_DATA
    );
  }
}

function _applyConfigDefaults(
  config?: MyDialogConfig,
  defaultOptions?: MyDialogConfig
): MyDialogConfig {
  return { ...defaultOptions, ...config };
}
