import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CursoService} from "../../../../services/curso.service";
import {Curso} from "../../../../models/curso";
import {map, Observable, startWith} from "rxjs";
import {FormControl} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {PersonaCliente} from "../../../../models/personaCliente";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {UsuarioService} from "../../../../services/usuario.service";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];


@Component({
  selector: 'app-asistenciacurso',
  templateUrl: './asistenciacurso.component.html',
  styleUrls: ['./asistenciacurso.component.css']
})
export class AsistenciacursoComponent implements OnInit {


  displayedColumns: string[] = ['id', 'cedula', 'nombres'];
  dataSource: MatTableDataSource<PersonaCliente>;


  cargauno:boolean;
  habiliar:boolean;

  curso: Curso[] = [];
  myControl = new FormControl();
  dataCursos?: Observable<Curso[]>;
  diasListado: fechas[] = [];

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(private cursoService: CursoService,
              private usuarioService:UsuarioService) {
  }

  ngOnInit(): void {
    this.cargauno=true;
    this.cursoService.getAllCurso().subscribe(value => {
      this.cursoService.getFecha().subscribe(fecha => {
          this.curso = value.filter(value1 => value1.fechaFin < fecha);
          this.dataCursos = this.myControl.valueChanges.pipe(
            startWith(''),
            map(values => this.filter(values)),
          );
        this.cargauno=false;
        }
      )
    })
  }

  filter(value: any): Curso[] {
    var pipe: DatePipe = new DatePipe('en-US')
    const filterValue = value.toLowerCase();
    return this.curso.filter(option => option.nombre?.toLowerCase().includes(filterValue)
      || pipe.transform(option.fechaFin, 'YYYY').toLocaleLowerCase().includes(filterValue)
    );
  }

  obtenerfechas(select: MatSelect) {
    this.cargauno=true;
    var dia: fechas[] = [];
    this.cursoService.getClientesCurso(select.value).subscribe(value => {
      var fechaInicio = new Date((value.fechaInicio)).getTime()
      var fechaFin = new Date(value.fechaFin).getTime()
      var diff = fechaFin - fechaInicio;
      for (let i = 1; i < diff / (1000 * 60 * 60 * 24) + 2; i++) {
        dia.push({
          id: value.idCurso,
          fecha: addDaysToDate(value.fechaInicio, i)
        })
      }
      this.habiliar=true;
      this.cargauno=false;
      this.diasListado = dia;
    },error => {
      this.habiliar=false;
      this.cargauno=false;
    })

  }

  obtnerlistado(select: MatSelect) {
    this.cargauno=true;
    this.cursoService.getClientesCurso(select.value.id).subscribe(value => {
      this.dataSource = new MatTableDataSource<PersonaCliente>(value.listaClientesRequests)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cargauno=false;
    })

  }

  onbtenerPDF(select: MatSelect) {
    this.cargauno=true;
    var pipe: DatePipe = new DatePipe('es')
    var dia: String = new Date().toISOString();
    this.usuarioService.getAllUsuarios().subscribe(valueb =>{
      this.cursoService.getClientesCurso(select.value.id).subscribe(async value => {
        var alumnos: PersonaCliente[] = value.listaClientesRequests.sort((a, b) => {
          if (a.apellidos > b.apellidos) {
            return 1;
          }
          if (a.apellidos < b.apellidos) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
        const pdfDefinition: any = {
          content: [
            {image: await this.getBase64ImageFromURL('assets/images/LogoValleNegro.png'), width: 100},
            {
              text: '_________________________________________________________________________________________',
              alignment: 'center'
            },
            // @ts-ignore
            {text: pipe.transform(dia, 'MMMM d, y'), alignment: 'right'},
            {text: 'LISTA DE PARTICIPANTES', fontSize: 15, bold: true, alignment: 'center'},
            {text: 'Curso de ' + value.nombre, fontSize: 15, margin: [0, 0, 20, 0]},
            {text: '    '},
            {text: 'Nombre del responsable: ' + value.responsable},
            {text: '    '},
            {text: 'Lugar donde se llevara a cabo: ' + value.lugar},
            {text: '    '},
            {text: 'Dia de actividad: ' + pipe.transform(select.value.fecha, 'd, MMMM, y')},
            {text: '    '},
            {text: 'Participantes'},
            {
              table: {
                headerRows: 1,
                widths: ['10%', '25%', '40%', '25%'],
                body: [
                  ['ID', 'CEDULA', 'MOMBRES COMPLETOS', 'FIRMA'],
                  [alumnos.map(function (item, index) {
                    return '  \n'+(index + 1)
                  }),
                    alumnos.map(function (item) {
                      return '  \n'+ item.cedula + ''
                    }),
                    alumnos.map(function (item) {
                      return '  \n'+item.apellidos + ' ' + item.nombres
                    }),
                    alumnos.map(function (item) {
                      return '  \n'+'_____________________'
                    })
                  ],
                ]
              },
            },
            {text: '    '},
            {text: '    '},
            {
              table: {
                headerRows: 1,
                widths: ['50%', '50%'],
                body: [
                  ['RESPONSABLE: ' + value.responsable, 'BIBLIOTECARIO/A: ' + valueb.filter(value1 => value1.idRol == 1).pop().apellidos + ' ' + valueb.filter(value1 => value1.idRol == 1).pop().nombres],
                  ['Firma:', 'Firma:']
                ]
              },
            }
          ]
        }
        const pdf = pdfMake.createPdf(pdfDefinition);
        pdf.open();
        this.cargauno = false;
      })
    })
  }

  getBase64ImageFromURL(url:any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        // @ts-ignore
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  };
}

interface fechas {
  id: Number;
  fecha: Date
}

function addDaysToDate(date, days): any {
  var res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
}
