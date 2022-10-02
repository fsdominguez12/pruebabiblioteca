export class Impresion_Copia {
    id?: any;
    fecha?: any;
    idCliente?: any;
    pagBlanco?: any;
    pagColor?: any;
    idCopia?:any;
}


export class Cliente_Impresion{
    id?: any;
    fechaEntrega?: any;
    idCliente?: any;
    idCopias?: any;
    pagBlanco?: any;
    pagColor?: any;
    pagTotal?: any;
    apellido?:any;
    nombre?:any;
}


export class ReporteImpresionyCopias{
  anio: number;
  mes: number
  femenino: datos;
  masculino:datos;
  otros: datos;
  total:number;

}

export class datos{
  num: number
  pct: number
}


