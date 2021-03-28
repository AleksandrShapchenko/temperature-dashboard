import {Component, OnInit} from '@angular/core';
import {GenerateDataService} from '../../core/generate-data.service';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-temperature-page',
  templateUrl: './temperature-page.component.html',
  styleUrls: ['./temperature-page.component.less']
})
export class TemperaturePageComponent implements OnInit {
  temperature: number | string | undefined;
  humidity: number | string | undefined;
  airPressure: number | string | undefined;

  constructor(private dataService: GenerateDataService) {
  }

  ngOnInit(): void {
    const maxEventDelay = 1000;
    let temperaturePreviousEventTime = Date.now();
    let humidityPreviousEventTime = Date.now();
    let airPressurePreviousEventTime = Date.now();

    const temperatureEventStream$ = fromEvent(document, 'generateTemperature').subscribe(e => {
      this.temperature = Date.now() - temperaturePreviousEventTime > maxEventDelay
        ? 'N/A'
        : this.dataService.temperature;
      temperaturePreviousEventTime = Date.now();
    });
    const humidityEventStream$ = fromEvent(document, 'generateHumidity').subscribe(e => {
      this.humidity = Date.now() - humidityPreviousEventTime > maxEventDelay
        ? 'N/A'
        : this.dataService.humidity;
      humidityPreviousEventTime = Date.now();
    });
    const airPressureEventStream$ = fromEvent(document, 'generateAirPressure').subscribe(e => {
      this.airPressure = Date.now() - airPressurePreviousEventTime > maxEventDelay
        ? 'N/A'
        : this.dataService.airPressure;
      airPressurePreviousEventTime = Date.now();
    });
  }
}
