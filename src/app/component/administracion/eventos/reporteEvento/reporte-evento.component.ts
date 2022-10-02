import { Component, OnInit } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {LibroService} from "../../../../services/libro.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UsuarioService} from "../../../../services/usuario.service";
import {EventoService} from "../../../../services/evento.service";
import {Evento} from "../../../../models/evento";
import {MatSelect} from "@angular/material/select";
import {DatePipe} from "@angular/common";
import {PersonaCliente} from "../../../../models/personaCliente";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reporteEvento',
  templateUrl: './reporte-evento.component.html',
  styleUrls: ['./reporte-evento.component.css']
})
export class ReporteEventoComponent implements OnInit {


  cargar:boolean;
  habilitar:boolean;

  evento:Evento[]=[]

  constructor(private _snackBar: MatSnackBar,
              private usuarioService:UsuarioService,
              private eventoService:EventoService) { }

  ngOnInit(): void {
  }
  consultarDatos(mes: HTMLInputElement){
    this.cargar=true;
    var n:String[]=[]
    n=mes.value.split('-');
    console.log(n)
    this.eventoService.getReporteEvento(n[1],n[0]).subscribe(value => {
      this.evento=value
      this.cargar=false;
      this.habilitar=true;
    },error => {
      this._snackBar.open(error.error.message,'ACEPTAR')
      this.cargar=false;
    })
  }

  generatePDF(mes: HTMLInputElement) {
    this.cargar=true;
    var n:String[]=[]
    n=mes.value.split('-');
    var pipe: DatePipe = new DatePipe('es')
    var dia: String = new Date().toISOString();
    this.usuarioService.getAllUsuarios().subscribe(valueb => {
      this.eventoService.getReporteEvento(n[1],n[0]).subscribe(async value => {
        const pdfDefinition: any = {
          content: [
            {image: await this.getBase64ImageFromURL('assets/images/LogoValleNegro.png'), width: 100},
            {
              text: '_________________________________________________________________________________________',
              alignment: 'center'
            },
            // @ts-ignore
            {text: pipe.transform(dia, 'MMMM d, y'), alignment: 'right'},
            {text: 'REPORTE DE EVENTO', fontSize: 15, bold: true, alignment: 'center'},
            {text: '      '},
            {text: 'MES: '+mes.value},
            {text: '    '},
            {text: 'REPORTE POR GENERO'},
            {
              table: {
                headerRows: 1,
                widths: ['50%', '50%'],
                body: [
                  ['CUADRO DE DATOS', ''],
                  ['NÚMERO DE EVENTOS', value.length],
                ]
              }
            },
            {text: '    '},
            {text: 'LISTA DE EVENTOS'},
            {
              table: {
                headerRows: 1,
                widths: ['10%', '40%', '25%', '25%'],
                body: [
                  ['ID', 'NOMBRE', 'FECHA', 'Nº PARTICIPANTES'],
                  [value.map(function (item, index) {
                    return (index + 1)
                  }),
                    value.map(function (item) {
                      return item.descripcion + ''
                    }),
                    value.map(function (item) {
                      return item.fecha
                    }),
                    value.map(function (item) {
                      return item.numParticipantes
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
                widths: ['100%'],
                body: [
                  ['BIBLIOTECARIO/A: ' + valueb.filter(value1 => value1.idRol == 1).pop().apellidos + ' ' + valueb.filter(value1 => value1.idRol == 1).pop().nombres],
                  ['Firma:']
                ]
              },
            }
          ]
        }
        this.cargar=false;
        const pdf = pdfMake.createPdf(pdfDefinition);
        pdf.open();
      })

    })
  }

  getBase64ImageFromURL(url: any) {
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

  seleccion:String;
  select(arr){
    this.seleccion=arr.value;
  }

}
