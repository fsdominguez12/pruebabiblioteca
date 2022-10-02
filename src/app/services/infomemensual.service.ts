import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { servicioUsado } from '../models/informemensual';

@Injectable({
    providedIn: 'root'
})

export class informeMensualService {
    _url = 'http://localhost:8082/api'


    private httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
    })



    constructor(
        private http: HttpClient,
    ) {
    }

    getServicioDiario(mes:any,anio:any) {
       
    }

    getServicioDiario1(mes:any,anio:any):Observable<servicioUsado[]>{
        return null
      }


}
