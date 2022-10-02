import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { ServicioClienteVarios, ServiciosVarios, ServicioVariosClienteTabla } from '../models/ServiciosVarios';



@Injectable({
    providedIn: 'root'
})

export class serviciosVariosService {
    private httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
    })


    constructor(
        private http: HttpClient) {
    }

    createServicioVarios(dato: ServiciosVarios): Observable<ServiciosVarios> {
        return this.http.post(environment.URL_APP + "/serviciosVarios/create/serviciovarios", dato, { headers: this.httpHeaders })
    }

    createServicioVariosCliente(dato: ServiciosVarios): Observable<ServiciosVarios> {
        return this.http.post(environment.URL_APP + "/serviciosVarios/registroServicioCliente", dato, { headers: this.httpHeaders })
    }

    getServicioVarios(): Observable<ServiciosVarios[]> {
        return this.http.get(environment.URL_APP + "/serviciosVarios/all/serviciovarios", { headers: this.httpHeaders }).pipe(map(Response => Response as ServiciosVarios[]))
    }

    getServicioVariosCliente(mes: any, anio: any): Observable<ServicioVariosClienteTabla[]> {
        return this.http.get(environment.URL_APP + "/serviciosVarios/listAllServicioCliente/" + mes + "/" + anio, { headers: this.httpHeaders }).pipe(map(Response => Response as ServicioVariosClienteTabla[]))
    }


    putServicioVarios(dato: ServiciosVarios): Observable<ServiciosVarios> {
        return this.http.put(environment.URL_APP + "/serviciosVarios/update/serviciovarios", dato, { headers: this.httpHeaders })
    }

    putServicioVariosCliente(dato: ServicioClienteVarios): Observable<ServicioClienteVarios> {
        return this.http.put(environment.URL_APP + "/serviciosVarios/actualizarServicioCliente", dato, { headers: this.httpHeaders })
    }

}
