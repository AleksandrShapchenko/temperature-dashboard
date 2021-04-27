import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { ModalDialogService } from './modal-dialog.service';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.less']
})
export class ModalDialogComponent implements OnInit {
  @Input() id: string;
  private element: any;

  constructor(
    private dialogService: ModalDialogService,
    private el: ElementRef,
    private renderer2: Renderer2
  ) {
    this.element = el.nativeElement;
    console.log(el);
  }

  ngOnInit(): void {
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    this.renderer2.appendChild(document.body, this.element);

    this.renderer2.listen(this.element, 'click', (e: any): void => {
      if (e.target.className === 'modal-dialog') {
        this.close();
      }
    });

    this.dialogService.addToOpened(this);
  }

  ngOnDestroy(): void {
    this.dialogService.removeFromOpened(this.id);
    this.renderer2.removeChild(document.body, this.element);
  }

  open(): void {
    this.renderer2.setStyle(this.element, 'display', 'block');
    this.renderer2.addClass(document.body, 'modal-dialog-open');
  }

  close(): void {
    this.renderer2.setStyle(this.element, 'display', 'none');
    this.renderer2.removeClass(document.body, 'modal-dialog-open');
  }
}
