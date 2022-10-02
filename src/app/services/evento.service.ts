import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Evento} from '../models/evento';
import {map, Observable} from "rxjs";
import {environment} from 'src/environments/environment';
import {ReporteImpresionyCopias} from "../models/impresion-copia";

@Injectable({
  providedIn: 'root'
})

export class EventoService {
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })


  constructor(
    private http: HttpClient) {
  }


  createEvento(evento: Evento): Observable<Evento> {
    return this.http.post(environment.URL_APP + "/eventos/registrarEvento", evento, {headers: this.httpHeaders})
  }

  putEvento(evento: Evento): Observable<Evento> {
    return this.http.put(environment.URL_APP + "/eventos/updateevento", evento, {headers: this.httpHeaders})
  }

  getEventoSinParticipantes(): Observable<Evento[]> {
    return this.http.get(environment.URL_APP + "/eventos/listeventossinparticipantes", {headers: this.httpHeaders}).pipe(map(Response => Response as Evento[]))
  }

  getEventoConParticipantes(): Observable<Evento[]> {
    return this.http.get(environment.URL_APP + "/eventos/listeventosconparticipantes", {headers: this.httpHeaders}).pipe(map(Response => Response as Evento[]))
  }

  deleteEvento(id: number) {
    return this.http.delete(environment.URL_APP + "/eventos/eliminarevento/" + id, {headers: this.httpHeaders});
  }

  getReporteEvento(mes: any, anio:any): Observable<Evento[]> {
    return this.http.get(environment.URL_APP + "/eventos/eventospormes/" + mes +"/"+ anio, {headers: this.httpHeaders}).pipe(map(Response => Response as Evento[]))
  }

}
