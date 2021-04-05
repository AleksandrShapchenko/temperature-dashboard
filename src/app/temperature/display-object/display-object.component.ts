import { Component, Input, OnInit } from '@angular/core';
import { DisplayObject } from '../../shared/models/display-object';

@Component({
  selector: 'app-display-object',
  templateUrl: './display-object.component.html',
  styleUrls: ['./display-object.component.less'],
})
export class DisplayObjectComponent implements OnInit {
  @Input() displayObject: DisplayObject | null | undefined;
  constructor() {}

  ngOnInit(): void {}
}
