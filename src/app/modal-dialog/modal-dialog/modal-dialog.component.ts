import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ModalDialogService } from '../modal-dialog.service';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.less']
})
export class ModalDialogComponent implements OnInit, AfterViewInit {
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @ViewChild('modalDialog') modalDialog: ElementRef;
  @ViewChild('modalDialogBackground') modalDialogBackground: ElementRef;
  private display = 'none';
  private readonly element: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer2: Renderer2,
    private modalDialogService: ModalDialogService
  ) {
    this.element = el.nativeElement;
  }

  @HostBinding('style.display') get getElementDisplay(): string {
    return this.display;
  }

  ngOnInit(): void {
    this.renderer2.appendChild(document.body, this.element);
  }

  ngAfterViewInit(): void {
    this.modalDialog.nativeElement.addEventListener(
      'click',
      (e: Event): void => {
        if ((e.target as HTMLDivElement).className === 'modal-dialog')
          this.dismiss();
      }
    );
  }

  ngOnDestroy(): void {
    this.renderer2.removeChild(document.body, this.element);
  }

  open(): void {
    this.display = 'block';
    this.modalDialogService.incrementOpenedModalCount();
    if (!document.body.classList.contains('modal-dialog-open')) {
      this.renderer2.addClass(document.body, 'modal-dialog-open');
      this.modalDialogBackground.nativeElement.style.display = 'block';
    }
  }

  dismiss(): void {
    this.display = 'none';
    this.modalDialogService.decrementOpenedModalCount();
    if (!this.modalDialogService.getOpenedModalCount()) {
      this.renderer2.removeClass(document.body, 'modal-dialog-open');
      this.modalDialogBackground.nativeElement.style.display = 'none';
    }
    this.closeModalEvent.emit(false);
  }

  confirm(): void {
    this.display = 'none';
    this.modalDialogService.decrementOpenedModalCount();
    if (!this.modalDialogService.getOpenedModalCount()) {
      this.renderer2.removeClass(document.body, 'modal-dialog-open');
      this.modalDialogBackground.nativeElement.style.display = 'none';
    }
    this.closeModalEvent.emit(true);
  }
}
