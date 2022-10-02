import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Evento } from 'src/app/models/evento';
import { EventoService } from 'src/app/services/evento.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from "sweetalert2";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { DatePipe } from "@angular/common";

pdfMake.vfs = pdfFonts.pdfMake.vfs;



@Component({
  selector: 'app-crudevento',
  templateUrl: './crudevento.component.html',
  styleUrls: ['./crudevento.component.css']
})
export class CrudeventoComponent implements OnInit {

  public mensajeSinParticiantes: any = "ACTUALMENTE NO HAY EVENTOS"

  public eventoListaGuardar: Evento = new Evento();
  public idEvento: any;

  public eventoLista: Evento[] = [];

  public divNuevo: Boolean = true;
  public divListar: Boolean = false;
  public cardListarModulo: Boolean;
  public botonParaGuardar: Boolean = true;
  public botonParaEditar: Boolean = false;
  public cardListarVacio: Boolean;


  public numeroControl: number = 1;


  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });


  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public eventoService: EventoService,
    private _snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.listarEventoSinParticipantes();
  }


  public mostrarLista() {
    this.listarEventoSinParticipantes();
    this.numeroControl = 1;
    this.divListar = true;
    this.divNuevo = false;
  }

  public mostrarNuevo() {

    if (this.numeroControl == 3) {
      this.vaciarFormulario();
      this.botonParaGuardar = true;
      this.botonParaEditar = false;
      this.numeroControl = 1;
    }

    this.divListar = false;
    this.divNuevo = true;


  }


  formGrupos = new FormGroup({
    descripcion: new FormControl<String>('', [Validators.required]),
    actividades: new FormControl<String>('', [Validators.required]),
    fecha: new FormControl<Date>(null, [Validators.required]),
    observacion: new FormControl<String>('', [Validators.required]),
  })

  guardarEvento() {

    this.eventoListaGuardar.descripcion = Object.values(this.formGrupos.getRawValue())[0];
    this.eventoListaGuardar.actividades = Object.values(this.formGrupos.getRawValue())[1];
    this.eventoListaGuardar.fecha = Object.values(this.formGrupos.getRawValue())[2];
    this.eventoListaGuardar.observaciones = Object.values(this.formGrupos.getRawValue())[3];
    this.eventoListaGuardar.documento = null;
    this.eventoListaGuardar.numParticipantes = null;
    this.eventoListaGuardar.usuarioid = "1";

    console.log("Evento Guardado");
    console.log(this.eventoListaGuardar);

    this.eventoService.createEvento(this.eventoListaGuardar).subscribe(value => {
      this._snackBar.open('Evento registrado', 'ACEPTAR');
      this.vaciarFormulario();
      this.listarEventoSinParticipantes();
      this.mostrarLista();
    }, error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
      //this.loaderGuardar=false
    })

  }

  vaciarFormulario() {
    this.formGrupos.setValue({
      actividades: "",
      descripcion: "",
      fecha: null,
      observacion: "",

    })
  }


  displayedColumnsTaller: string[] = ['id', 'fecha', 'descripcion', 'actividades', 'observaciones', 'editar', 'eliminar', 'poster'];
  dataSourceEvento: MatTableDataSource<Evento>;


  applyFilterEvento(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEvento.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceEvento.paginator) {
      this.dataSourceEvento.paginator.firstPage();
    }
  }

  listarEventoSinParticipantes() {
    this.eventoService.getEventoSinParticipantes().subscribe(value => {

      this.eventoLista = value;

      if (this.eventoLista.length > 0) {
        this.cardListarModulo = true;
        this.cardListarVacio = false;
      } else if (this.eventoLista.length == 0) {
        this.cardListarModulo = false;
        this.cardListarVacio = true;
      }


      this.dataSourceEvento = new MatTableDataSource(this.eventoLista);
      this.dataSourceEvento.paginator = this.paginator;
      this.dataSourceEvento.sort = this.sort;
      console.log("Listado eventos generado exitosamente");
      console.log(this.eventoLista)
    })

  }

  //EDITAR

  editarEvento(id: any) {
    this.idEvento = id;
    this.botonParaGuardar = false;
    this.botonParaEditar = true;

    for (var k = 0; k < this.eventoLista.length; k++) {
      if (this.eventoLista[k].id == id) {

        var fecha = new Date(this.eventoLista[k].fecha);
        var dias = 1; // Número de días a agregar
        fecha.setDate(fecha.getDate() + dias);
        console.info(fecha)


        this.formGrupos.setValue({
          actividades: this.eventoLista[k].actividades,
          descripcion: this.eventoLista[k].descripcion,
          fecha: fecha,
          //fecha: this.eventoLista[k].fecha,
          observacion: this.eventoLista[k].observaciones,

        })
        this.mostrarNuevo();
        this.numeroControl = 3;
      }

    }
  }


  guardarEditarEvento() {
    this.eventoListaGuardar.descripcion = Object.values(this.formGrupos.getRawValue())[0];
    this.eventoListaGuardar.actividades = Object.values(this.formGrupos.getRawValue())[1];
    this.eventoListaGuardar.fecha = Object.values(this.formGrupos.getRawValue())[2];
    this.eventoListaGuardar.observaciones = Object.values(this.formGrupos.getRawValue())[3];
    this.eventoListaGuardar.documento = null;
    this.eventoListaGuardar.numParticipantes = null;
    this.eventoListaGuardar.usuarioid = "1";
    this.eventoListaGuardar.id = this.idEvento;


    console.log("Datos Actualizar");
    console.log(this.eventoListaGuardar);

    this.eventoService.putEvento(this.eventoListaGuardar).subscribe(value => {
      this._snackBar.open('Evento Actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonParaGuardar = true;
      this.botonParaEditar = false;
      this.listarEventoSinParticipantes();
      this.mostrarLista();
    }, error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
      //this.loaderGuardar=false
    })


  }

  //ELIMINAR

  eliminarEvento(idEvento: any) {

    Swal.fire({
      title: "¿Estas seguro?",
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "¡Sí, bórralo!",
      cancelButtonText: "Cancelar",
      background: '#f7f2dc',
      confirmButtonColor: '#f47f16',
      cancelButtonColor: '#d33',
      backdrop: false
    })
      .then(resultado => {
        if (resultado.value) {

          this.eventoService.deleteEvento(idEvento).subscribe(value => {
            this.listarEventoSinParticipantes();
            this._snackBar.open('Eliminado exitosamente', 'ACEPTAR');

          }, error => {
            this._snackBar.open(error.error.message, 'ACEPTAR');
          })
        }
      });
  }

  async optenerPoste(evento: Evento) {
    var pipe: DatePipe = new DatePipe('es')
    const pdfDefinition: any = {
      pageSize: 'LETTER',
      background: [
        {
          image: await this.getBase64ImageFromURL('assets/images/evento2.jpg'),
          height: 792,
          width: 612,
        }
      ],
      content: [
        { text: '  ' },
        { text: '  ' },
        { text: '  ' },
        { text: '  ' },
        { text: '  ' },
        { image: await this.getBase64ImageFromURL('assets/images/LogoValleNegro.png'), width: 200 },
        { text: '  ' },
        { text: 'EVENTO', fontSize: 70, bold: true, alignment: 'center' },
        { text: '  ' },
        { text: '  ' },
        { text: evento.descripcion.toUpperCase(), fontSize: 50, bold: true, alignment: 'center' },
        { text: '  ' },
        { text: pipe.transform(evento.fecha, 'd/MMMM/y').toUpperCase(), fontSize: 40, bold: true, alignment: 'center' },
        { text: '  ' },
        { text: '  ' },
        {
          table: {
            headerRows: 1,
            widths: ['50%', '50%'],
            body: [
              ['ACTIVIDADES', 'OBSERVACIONES'],
              [evento.actividades, evento.observaciones]
            ]
          }
        }
      ]
    }
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
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
}

