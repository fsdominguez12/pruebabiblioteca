import {PersonaCliente} from "./personaCliente";

export class Curso {
  id?: any;
  idCurso?: any;
  nombre?: any;
  lugar?: any;
  descripcion?: any;
  responsable?: any;
  fechaInicio?: Date;
  fechaFin?: Date;
  fechaMaxInscripcion?: any;
  materiales?: any;
  actividades?: any;
  numParticipantes?: any;
  listaClientesRequests?: PersonaCliente[]

}


export class ReporteCurso {
  n_Femenino:number;
  n_Masculino:number;
  n_Otro:number;
  porcent_Femenino:number;
  porcent_Masculino:number;
  porcent_Otro:number;
  total:number;
}

export class ContarNumeroClass {
  numero?: any;
}

export class ContarPorIdCurso {

}

