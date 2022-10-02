import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {environment} from 'src/environments/environment';
import {Cliente_Impresion, Impresion_Copia, ReporteImpresionyCopias} from '../models/impresion-copia';
import {ReporteCurso} from "../models/curso";
import {PersonaCliente} from "../models/personaCliente";

@Injectable({
  providedIn: 'root'
})

export class Impresion_CopiaService {
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })


  constructor(
    private http: HttpClient) {
  }


  createImpresionCopia(impresion: Impresion_Copia): Observable<Impresion_Copia> {
    return this.http.post(environment.URL_APP + "/copias/registrocopias", impresion, {headers: this.httpHeaders})
  }


  getClienteImpresion(mes: any, anio: any): Observable<Cliente_Impresion[]> {
    return this.http.get(environment.URL_APP + "/copias/allCopiasbymesandanio/" + mes + "/{anio}?anio=" + anio, {headers: this.httpHeaders}).pipe(map(Response => Response as Cliente_Impresion[]))
  }


  putImpresionCopia(dato: Impresion_Copia): Observable<Impresion_Copia> {
    return this.http.put(environment.URL_APP + "/copias/updateregistrodecopias", dato, {headers: this.httpHeaders})
  }

  getReporteCopias(mes: any, anio:any): Observable<ReporteImpresionyCopias> {
    return this.http.get(environment.URL_APP + "/estadisticas/filtrarByGeneroCopias/" + mes +"/"+ anio, {headers: this.httpHeaders}).pipe(map(Response => Response as ReporteImpresionyCopias))
  }

  getReporteCopiasClientes(mes: any, anio: any): Observable<PersonaCliente[]> {
    return this.http.get(environment.URL_APP + "/estadisticas/datosEstadisticosCopias/" + mes + "/" + anio, {headers: this.httpHeaders}).pipe(map(Response => Response as PersonaCliente[]))
  }
}
