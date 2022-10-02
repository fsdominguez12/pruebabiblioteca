import { Component, OnInit } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {Curso, ReporteCurso} from "../../../../models/curso";
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {ReporteTaller, Taller} from "../../../../models/taller";
import {CursoService} from "../../../../services/curso.service";
import {UsuarioService} from "../../../../services/usuario.service";
import {TallerService} from "../../../../services/taller.service";
import {DatePipe} from "@angular/common";
import {MatSelect} from "@angular/material/select";
import {PersonaCliente} from "../../../../models/personaCliente";
import {MatSnackBar} from "@angular/material/snack-bar";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reporteTaller',
  templateUrl: './reporte-taller.component.html',
  styleUrls: ['./reporte-taller.component.css']
})
export class ReporteTallerComponent implements OnInit {

  cargar:boolean;
  habilitar:boolean;

  reporteTaller:ReporteTaller=new ReporteTaller();

  taller: Taller[] = [];
  myControl = new FormControl();
  dataTaller?: Observable<Taller[]>;

  constructor(private tallerService:TallerService,
              private usuarioService:UsuarioService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.filterAnio('')
  }
  filterAnio(anio:any){
    this.cargar=true;
    var pipe: DatePipe = new DatePipe('en-US')
    if(anio!=''){
      console.log(anio.target.value)
      this.tallerService.getAllTaller().subscribe(value => {
        this.taller = value.filter(value1 => pipe.transform(value1.fechaFin,'YYYY')==anio.target.value);
        this.dataTaller = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values => this.filter(values)),
        );
        this.cargar=false;
      })
    } else {
      this.tallerService.getAllTaller().subscribe(value => {
        this.taller = value;
        this.dataTaller = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values => this.filter(values)),
        );
        this.cargar=false;
      })
    }
  }

  filter(value: any): Curso[] {
    var pipe: DatePipe = new DatePipe('en-US')
    const filterValue = value.toLowerCase();
    return this.taller.filter(option => option.nombre?.toLowerCase().includes(filterValue)
    );
  }

  consultaDatos(select: MatSelect){
    this.cargar=true;
    this.tallerService.getReporteTaller(select.value.idTaller).subscribe(value => {
      this.reporteTaller=value
      this.reporteTaller.porcent_Femenino=Math.round(value.porcent_Femenino)
      this.reporteTaller.porcent_Masculino=Math.round(value.porcent_Masculino)
      this.reporteTaller.porcent_Otro=Math.round(value.porcent_Otro)
      this.cargar=false;
      this.habilitar=true;
    },error => {
      this.cargar=false;
      this._snackBar.open(error.error.message, 'ACEPTAR');
    })
  }


  generatePDF(select: MatSelect) {
    this.cargar=true;
    var pipe: DatePipe = new DatePipe('es')
    var dia: String = new Date().toISOString();
    this.usuarioService.getAllUsuarios().subscribe(valueb =>{
      this.tallerService.getClientesTaller(select.value.idTaller).subscribe( cliente => {
        var alumnos: PersonaCliente[] = cliente.listaClientesTallerRequests.sort((a, b) => {
          if (a.apellidos > b.apellidos) {
            return 1;
          }
          if (a.apellidos < b.apellidos) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
        this.tallerService.getReporteTaller(select.value.idTaller).subscribe(async value => {
          const pdfDefinition: any = {
            content: [
              {image: await this.getBase64ImageFromURL('assets/images/LogoValleNegro.png'), width: 100},
              {
                text: '_________________________________________________________________________________________',
                alignment: 'center'
              },
              // @ts-ignore
              {text: pipe.transform(dia, 'MMMM d, y'), alignment: 'right'},
              {text: 'REPORTE DE TALLERES', fontSize: 15, bold: true, alignment: 'center'},
              {text: 'Taller de ' + select.value.nombre, fontSize: 15, margin: [0, 0, 20, 0]},
              {text: '    '},
              {text: 'Nombre del responsable: ' + select.value.responsable},
              {text: '    '},
              {text: 'Lugar donde se llevara a cabo: ' + select.value.lugar},
              {text: '    '},
              {text: 'REPORTE POR GENERO'},
              {
                table: {
                  headerRows: 1,
                  widths: ['34,4%', '33,4%', '33,4%'],
                  body: [
                    ['CUADRO DE DATOS SEGÚN EL GÉNERO', 'Nº', '%'],
                    ['MASCULINO', value.n_Masculino, Math.round(value.porcent_Masculino) + '%'],
                    ['FEMENINO', value.n_Femenino, Math.round(value.porcent_Femenino) + '%'],
                    ['OTRO', value.n_Otro, Math.round(value.porcent_Otro) + '%'],
                    ['TOTAL', value.total, '100%'],
                  ]
                }
              },
              {text: '    '},
              {
                table: {
                  headerRows: 1,
                  widths: ['10%', '20%', '25%', '25%','20%'],
                  body: [
                    ['ID', 'CEDULA', 'NOMBRES', 'APELLIDOS', 'GENERO'],
                    [alumnos.map(function (item, index) {
                      return (index + 1)
                    }),
                      alumnos.map(function (item) {
                        return item.cedula + ''
                      }),
                      alumnos.map(function (item) {
                        return item.nombres
                      }),
                      alumnos.map(function (item) {
                        return item.apellidos
                      }),
                      alumnos.map(function (item) {
                        return item.genero
                      })
                    ],
                  ]
                }
              },
              {text: '    '},
              {
                table: {
                  headerRows: 1,
                  widths: ['100%'],
                  body: [
                    ['BIBLIOTECARIO/A: ' + valueb.filter(value1 => value1.idRol == 1).pop().apellidos + ' ' + valueb.filter(value1 => value1.idRol == 1).pop().nombres],
                    ['Firma:']
                  ]
                },
              }
            ]
          }
          this.cargar = false;
          const pdf = pdfMake.createPdf(pdfDefinition);
          pdf.open();
        })
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

}
