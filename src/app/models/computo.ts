export class Computo{
    id?: any;
    numero?: any;
    ram?: any;
    discoDuro?: any;
    procesador?: any;
    estado?: boolean;
    estadoPrestamo?: any;
    observacionesComputador?: any;
}

export class ReporteComputo{
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
