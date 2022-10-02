import {PersonaCliente} from "./personaCliente";

export class Taller {
    id?: any;
    idTaller?: any;
    nombre?: any;
    lugar?: any;
    descripcion?: any;
    responsable?: any;
    fechaInicio?: Date;
    fechaFin?: Date;
    fechaMaxInscripcion?:any;
    numParticipantes?: any;
    listaClientesTallerRequests?:PersonaCliente[]

}

export class ReporteTaller {
  n_Femenino:number;
  n_Masculino:number;
  n_Otro:number;
  porcent_Femenino:number;
  porcent_Masculino:number;
  porcent_Otro:number;
  total:number;
}

export class ContarNumeroClassT{
    numero?:any;
}

export class ContarPorIdTaller{

}
