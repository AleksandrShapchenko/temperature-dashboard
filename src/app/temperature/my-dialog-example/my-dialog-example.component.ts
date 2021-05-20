import { Component, Inject } from '@angular/core';
import { MY_DIALOG_DATA, MyDialogRef } from '../../my-dialog';

@Component({
  selector: 'app-my-dialog-example',
  templateUrl: './my-dialog-example.component.html'
})
export class MyDialogExampleComponent {
  constructor(
    public dialogRef: MyDialogRef<MyDialogExampleComponent>,
    @Inject(MY_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close('No!');
  }
}
