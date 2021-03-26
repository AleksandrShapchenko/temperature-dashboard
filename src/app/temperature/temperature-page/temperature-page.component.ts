import { Component, OnInit } from '@angular/core';
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

  constructor(private dataService: GenerateDataService) { }

  ngOnInit(): void {
    const temperatureEventStream$ = fromEvent(document, 'generateTemperature').subscribe(e => {
      this.temperature = this.dataService.temperature;
    });
    const humidityEventStream$ = fromEvent(document, 'generateHumidity').subscribe(e => {
      this.humidity = this.dataService.humidity;
    });
    const airPressureEventStream$ = fromEvent(document, 'generateAirPressure').subscribe(e => {
      this.airPressure = this.dataService.airPressure;
    });
  }
}
