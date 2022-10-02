import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {environment} from 'src/environments/environment';
import {ActualizarEstado, ClienteComputador} from '../models/cliente-computador';
import {Computo, ReporteComputo} from '../models/computo';
import {Curso} from "../models/curso";
import {Evento} from "../models/evento";
import {ReporteLibros} from "../models/libro";
import {PersonaCliente} from "../models/personaCliente";

@Injectable({
  providedIn: 'root'
})

export class ComputoService {
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })


  constructor(
    private http: HttpClient) {
  }

  getAllComputoInventario(): Observable<Computo[]> {
    return this.http.get(environment.URL_APP + "/inventario/computo/all", {headers: this.httpHeaders}).pipe(map(Response => Response as Computo[]))
  }

  getAllComputo(): Observable<Computo[]> {
    return this.http.get(environment.URL_APP + "/inventario/computo/allClienteComputo/horaNull", {headers: this.httpHeaders}).pipe(map(Response => Response as Computo[]))
  }

  getComputoDisponible(estado: any): Observable<Computo[]> {
    return this.http.get(environment.URL_APP + "/inventario/computo/all/estado/" + estado, {headers: this.httpHeaders}).pipe(map(Response => Response as Computo[]))
  }


  createClienteComputador(dato: ClienteComputador): Observable<ClienteComputador> {
    return this.http.post(environment.URL_APP + "/inventario/computo/registrocomputadorcliente", dato, {headers: this.httpHeaders})
  }

  createComputo(computoRequest: Computo): Observable<Curso> {
    return this.http.post(environment.URL_APP + "/inventario/computo/registrocomputador", computoRequest, {headers: this.httpHeaders});
  }

  updateComputo(computoRequest: Computo): Observable<Curso> {
    return this.http.put(environment.URL_APP + "/inventario/computo/actualizarcomputador", computoRequest, {headers: this.httpHeaders})
  }

  updateActualizarEstado(computoRequest: ActualizarEstado): Observable<ActualizarEstado> {
    return this.http.put(environment.URL_APP + "/inventario/computo/actualizarcomputador/estado/prestamo", computoRequest, {headers: this.httpHeaders})
  }

  updateAgregarHoraFin(computoRequest: ClienteComputador): Observable<ClienteComputador> {
    return this.http.put(environment.URL_APP + "/inventario/computo/updatePrestamo", computoRequest, {headers: this.httpHeaders})
  }

  getReporteComputo(mes: any, anio: any): Observable<ReporteComputo> {
    return this.http.get(environment.URL_APP + "/estadisticas/filtrarByGeneroComputo/" + mes + "/" + anio, {headers: this.httpHeaders}).pipe(map(Response => Response as ReporteComputo))
  }

  getReporteComputoClientes(mes: any, anio: any): Observable<PersonaCliente[]> {
    return this.http.get(environment.URL_APP + "/estadisticas/datosEstadisticosComputo/" + mes + "/" + anio, {headers: this.httpHeaders}).pipe(map(Response => Response as PersonaCliente[]))
  }

  deletecomputo(id: number) {

  }

}
