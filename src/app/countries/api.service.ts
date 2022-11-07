import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

interface Country {
  country: string;
  code: string;
  iso3: string;
  populationCounts: Population[];
}

export interface Population {
  year: number;
  value: number;
}

export interface CountryObj {
  data: Country[];
  error: boolean;
  msg: string;
}

export interface CountryLocationRes {
  error: boolean;
  msg: string;
  data: { name: string; iso2: string; long: number; lat: number };
}

export interface CountryLocation {
  name: string;
  iso2: string;
  long: number;
  lat: number;
  population: number;
}

export interface RainData {
  latitude: number;
  longitude: number;
  hourly: HourlyRainData;
}

export interface HourlyRainData {
  time: string[];
  rain: number[];
}

export interface CountryTop {
  name: string;
  population: number;
  rainyWeekend: string[];
  rainyWorkDay: string[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private countryUrl = 'https://countriesnow.space/api/v0.1/countries';
  private weatherUrl = 'https://archive-api.open-meteo.com/v1/era5';

  constructor(private http: HttpClient) {}

  public getCountries(): Observable<Country[]> {
    return this.http.get<CountryObj>(`${this.countryUrl}/population`).pipe(
      map((obj) => obj.data),
      map((arr) => {
        arr.sort(
          (a, b) =>
            b.populationCounts[b.populationCounts.length - 1].value -
            a.populationCounts[a.populationCounts.length - 1].value
        );
        return arr;
      })
    );
  }

  public getCountryLocation(countryName: string): Observable<CountryLocationRes> {
    return this.http.post<CountryLocationRes>(`${this.countryUrl}/positions`, {
      country: countryName,
    });
  }

  public getWeatherByLocation(lat: number, long: number): Observable<RainData> {
    return this.http.get<RainData>(
      `${this.weatherUrl}?latitude=${lat}&longitude=${long}&start_date=2022-03-01&end_date=2022-05-31&hourly=rain`
    );
  }
}
