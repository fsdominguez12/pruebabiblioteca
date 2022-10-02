export class libro {
  id?: any;
  codigoLibro?: any;
  estado?: any;
  autor?: any;
  isbn?: any;
  nombre?: any;
}

export class PrestamoLibro {
  idPrestao?: any;
  fechaDev?: any;
  fechaEntrega?: any;
  idCliente?: any;
  idLibro?: any;
  observacionesEntrega?: any;
  observacionesDev?: any;

}

export class libroEstado {
  id?: any;
  estado?: any;
}

export class libroPrestamo {
  mesDev?: any;
  estado?: any;
  telefono?: any;
  cedula?: any;
  nombres?: any;
  apellidos?: any;
  codigoLibro?: any;
  anioDev?: any;
  diaDev?: any;
  anioPrestamo?: any;
  idPrestamo?: any;
  idLIbro?: any;
  mesPrestamo?: any;
  diaPrestamo?: any;
  observacionEntrega?: any;
}

export class ReporteLibros {
  anio: number;
  mes: number
  femenino: datos;
  masculino: datos;
  otros: datos;
  total: number;

}

export class datos {
  num: number
  pct: number
}
