import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ApiService,
  CountryLocation,
  CountryTop,
  HourlyRainData,
} from '../api.service';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  tap,
  toArray,
} from 'rxjs/operators';
import { EMPTY, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-countries-stat',
  templateUrl: './countries-stat.component.html',
  styleUrls: ['./countries-stat.component.css'],
})
export class CountriesStatComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  displayedColumns: string[] = [
    'position',
    'name',
    'population',
    'rainyWeekend',
    'rainyWorkDay',
  ];
  dataSource = new MatTableDataSource<CountryTop>([]);
  dataLoaded = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getCountries();
  }

  getCountries() {
    this.subscription = this.apiService
      .getCountries()
      .pipe(
        switchMap((res) => res),
        mergeMap((el) =>
          this.apiService.getCountryLocation(el.country).pipe(
            map((res) => {
              let countryPopulation =
                el.populationCounts[el.populationCounts.length - 1].value;
              const newObj: CountryLocation = {
                ...res.data,
                population: countryPopulation,
              };
              return newObj;
            }),
            catchError((err) => EMPTY)
          )
        ),
        toArray(),
        map((res) => res.sort((a, b) => b.population - a.population)),
        map((res) => res.slice(0, 20)),
        switchMap((res) => res),
        mergeMap((el) =>
          this.apiService.getWeatherByLocation(el.lat, el.long).pipe(
            map((res) => {
              let data = res.hourly;
              return { ...el, data };
            })
          )
        ),
        map((res) => {
          const rainyDays = this.getRainyDays(res.data);

          return { ...res, rainyDays };
        }),
        map((res) => {
          let rainyWeekend: string[] = [];
          let rainyWorkDay: string[] = [];

          res.rainyDays.forEach((el) => {
            if (this.isWeekend(el)) {
              rainyWeekend.push(el);
            } else {
              rainyWorkDay.push(el);
            }
          });

          const CountryObj: CountryTop = {
            name: res.name,
            population: res.population,
            rainyWeekend,
            rainyWorkDay,
          };
          return CountryObj;
        }),
        toArray(),
        tap((res) => this.createTable(res))
      )
      .subscribe((res) => (this.dataLoaded = true));
  }

  isWeekend(string: string) {
    var date = new Date(string);
    return date.getDay() === 6 || date.getDay() === 0;
  }

  private createTable(countries: CountryTop[]): void {
    countries.sort((a, b) => b.population - a.population);
    this.dataSource = new MatTableDataSource(countries);
  }

  private getRainyDays(data: HourlyRainData) {
    let rainyIdx = data.rain
      .map((el, i) => (el > 0 ? i : undefined))
      .filter((el) => el as Number);
    let rainyDays: string[] = [];
    for (let idx of rainyIdx) {
      if (idx) {
        let day = data.time[idx];
        let dayArr = day.split('T');
        if (!rainyDays.includes(dayArr[0])) {
          rainyDays.push(dayArr[0]);
        }
      }
    }
    return rainyDays;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
