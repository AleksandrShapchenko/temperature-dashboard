import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.less']
})
export class ModalDialogComponent implements OnInit {
  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  private readonly element: any;

  constructor(
    private el: ElementRef,
    private renderer2: Renderer2
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    this.renderer2.appendChild(document.body, this.element);

    this.renderer2.listen(this.element, 'click', (e: any): void => {
      if (e.target.className === 'modal-dialog') {
        this.dismiss();
      }
    });
  }

  ngOnDestroy(): void {
    this.renderer2.removeChild(document.body, this.element);
  }

  open(): void {
    this.renderer2.setStyle(this.element, 'display', 'block');
    this.renderer2.addClass(document.body, 'modal-dialog-open');
  }

  dismiss(): void {
    this.renderer2.setStyle(this.element, 'display', 'none');
    this.renderer2.removeClass(document.body, 'modal-dialog-open');
    this.closeModalEvent.emit(false);
  }

  confirm(): void {
    this.renderer2.setStyle(this.element, 'display', 'none');
    this.renderer2.removeClass(document.body, 'modal-dialog-open');
    this.closeModalEvent.emit(true);
  }
}
