import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {ContarNumeroClass, ContarPorIdCurso, Curso, ReporteCurso} from '../models/curso';
import {environment} from 'src/environments/environment';
import {Fecha} from "../models/fecha";

@Injectable({
  providedIn: 'root'
})

export class CursoService {

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })


  constructor(
    private http: HttpClient) {
  }


  createCurso(curso: Curso): Observable<Curso> {
    return this.http.post(environment.URL_APP + "/curso/registrarCurso", curso, {headers: this.httpHeaders})
  }

  getAllCurso(): Observable<Curso[]> {
    return this.http.get(environment.URL_APP + "/curso/allCursos", {headers: this.httpHeaders}).pipe(map(Response => Response as Curso[]))
  }

  getContarCurso(idCurso: any): Observable<ContarNumeroClass[]> {
    return this.http.get(environment.URL_APP + "/curso/contarclientesencurso/" + idCurso, {headers: this.httpHeaders}).pipe(map(Response => Response as ContarNumeroClass[]))
  }

  getClientesCurso(idCurso: any): Observable<Curso> {
    return this.http.get(environment.URL_APP + "/curso/allBylistaclientes/" + idCurso, {headers: this.httpHeaders}).pipe(map(Response => Response as Curso))
  }

  getReporteCurso(id: any): Observable<ReporteCurso> {
    return this.http.get(environment.URL_APP + "/curso/reportecursoporgenero/" + id, {headers: this.httpHeaders}).pipe(map(Response => Response as ReporteCurso))
  }

  saveClienteCurso(idCliente: any, idCurso: any) {
    return this.http.post(environment.URL_APP + "/curso/agregarcliente/" + idCliente + "/" + idCurso, null, {headers: this.httpHeaders})
  }

  findbyId(idCurso: any){
    return this.http.get(environment.URL_APP+"/curso/listarcursos/"+idCurso,{headers: this.httpHeaders}).pipe(map(Response => Response as Curso))
  }


  updateCurso(curso: Curso): Observable<Curso> {
    return this.http.put(environment.URL_APP + "/curso/updatebyidcurso", curso, {headers: this.httpHeaders})
  }

  deleteCurso(idcurso: number) {
    return this.http.delete(environment.URL_APP + "/curso/" + idcurso, {headers: this.httpHeaders});
  }

  deletePersonaCurso(idCliente: any, idCurso: any) {
    return this.http.delete(environment.URL_APP + "/curso/" + idCurso + "/cliente/" + idCliente, {headers: this.httpHeaders});
  }

  getFecha(): Observable<Date> {
    return this.http.get(environment.URL_APP + "/fecha", {headers: this.httpHeaders}).pipe(map(
      data => data as Date
    ));
  }


}



