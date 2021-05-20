import { Component, OnInit, ViewChild } from '@angular/core';
import { combineLatest, fromEvent, Observable } from 'rxjs';
import { map, pairwise, throttleTime } from 'rxjs/operators';

import { DisplayObject } from '../../shared/models/display-object';
import { ModalDialogComponent } from '../../modal-dialog';
import { MyDialogRef, MyDialogService } from '../../my-dialog';
import { MyDialogExampleComponent } from '../my-dialog-example/my-dialog-example.component';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.less']
})
export class TemperatureComponent implements OnInit {
  @ViewChild('modal') modal: ModalDialogComponent;
  public displayObject: Observable<DisplayObject> | undefined;

  public constructor(private myDialogService: MyDialogService) {}

  public ngOnInit(): void {
    const minPreviousEmitTime: number = 100;

    const temperatureEventStream: Observable<CustomEvent> = fromEvent<CustomEvent>(
      document,
      'generateTemperature'
    );
    const humidityEventStream: Observable<CustomEvent> = fromEvent<CustomEvent>(
      document,
      'generateHumidity'
    );
    const airPressureEventStream: Observable<CustomEvent> = fromEvent<CustomEvent>(
      document,
      'generateAirPressure'
    );

    this.displayObject = combineLatest([
      temperatureEventStream.pipe(
        pairwise(),
        map((eventPair: CustomEvent[]): string | number => {
          return mapDataFromEvent(eventPair, 'temperature');
        })
      ),

      humidityEventStream.pipe(
        pairwise(),
        map((eventPair: CustomEvent[]): string | number => {
          return mapDataFromEvent(eventPair, 'humidity');
        })
      ),

      airPressureEventStream.pipe(
        pairwise(),
        map((eventPair: CustomEvent[]): string | number => {
          return mapDataFromEvent(eventPair, 'airPressure');
        })
      )
    ]).pipe(
      map(
        (dataArray: (string | number)[]): DisplayObject => {
          return {
            temperature: dataArray[0],
            humidity: dataArray[1],
            airPressure: dataArray[2]
          };
        }
      ),
      throttleTime(minPreviousEmitTime)
    );

    function mapDataFromEvent(
      eventPair: CustomEvent[],
      propertyName: string
    ): string | number {
      const maxEventDelay: number = 1000;
      const previousEvent: CustomEvent = eventPair[0];
      const currentEvent: CustomEvent = eventPair[1];
      const delayFromPreviousEvent: number =
        currentEvent.timeStamp - previousEvent.timeStamp;

      return delayFromPreviousEvent > maxEventDelay
        ? 'N/A'
        : currentEvent.detail[propertyName];
    }
  }

  public onModalClosed(e: boolean): void {
    // logic here
    // console.log(e)
  }

  public openMyDialog(e: MouseEvent): void {
    const myDialogRef: MyDialogRef<any> = this.myDialogService.open(
      MyDialogExampleComponent,
      {
        width: '250px',
        data: { name: 'Joe' }
      }
    );

    myDialogRef.afterClosed().subscribe((result: any): void => {
      console.log('dialog result: ' + result);
    });
  }
}
