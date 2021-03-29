import {Component, OnInit} from '@angular/core';
import {GenerateDataService} from '../../core/generate-data.service';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-temperature-page',
  templateUrl: './temperature-page.component.html',
  styleUrls: ['./temperature-page.component.less']
})
export class TemperaturePageComponent implements OnInit {
  temperature: number | string = 'N/A';
  humidity: number | string = 'N/A';
  airPressure: number | string = 'N/A';

  constructor(private dataService: GenerateDataService) {
  }

  ngOnInit(): void {
    const maxEventDelay = 1000;
    let temperaturePreviousEventTime = Date.now();
    let humidityPreviousEventTime = Date.now();
    let airPressurePreviousEventTime = Date.now();

    const temperatureEventStream$ = fromEvent(document, 'generateTemperature');
    const humidityEventStream$ = fromEvent(document, 'generateHumidity');
    const airPressureEventStream$ = fromEvent(document, 'generateAirPressure');

    const temperatureEventSubscribtion = temperatureEventStream$.subscribe(e => {
      const delayFromPreviousEvent = Date.now() - airPressurePreviousEventTime;
      this.temperature = delayFromPreviousEvent > maxEventDelay
        ? 'N/A'
        : this.dataService.temperature;
      temperaturePreviousEventTime = Date.now();
    });

    const humidityEventSubscription = humidityEventStream$.subscribe(e => {
      const delayFromPreviousEvent = Date.now() - airPressurePreviousEventTime;
      this.humidity = delayFromPreviousEvent > maxEventDelay
        ? 'N/A'
        : this.dataService.humidity;
      humidityPreviousEventTime = Date.now();
    });

    const airPressureEventSubscription = airPressureEventStream$.subscribe(e => {
      const delayFromPreviousEvent = Date.now() - airPressurePreviousEventTime;
      this.airPressure = delayFromPreviousEvent > maxEventDelay
        ? 'N/A'
        : this.dataService.airPressure;
      airPressurePreviousEventTime = Date.now();
    });
  }
}
