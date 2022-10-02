

import { Component, OnInit, VERSION, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormControl } from "@angular/forms";
import { Evento } from "src/app/models/evento";
import { EventoService } from "src/app/services/evento.service";
import { Observable, ReplaySubject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: 'app-registro-evento',
  templateUrl: './registro-evento.component.html',
  styleUrls: ['./registro-evento.component.css'],

})
export class registroEventoComponent implements OnInit {

  public eventoLista: Evento[] = [];
  public selectedIdEvento: any;

  public eventoListaGuardar: Evento = new Evento();

  base64Output: string;

  public divNuevo: Boolean = true;
  public divListar: Boolean = false;

  public divMostrar: boolean = false;


  displayedColumns: string[] = ['id', 'fecha', 'nombre', 'parti', 'observacion', 'actividades', 'documento'];
  dataSource: MatTableDataSource<Evento>;

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private eventoService: EventoService,
    private _snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
    this.listarEventoSinParticipantes();
    this.listarEventosParticipantes();
  }



  public mostrarLista() {
    this.listarEventosParticipantes();
    this.divListar = true;
    this.divNuevo = false;
  }

  public mostrarNuevo() {
    this.divListar = false;
    this.divNuevo = true;
  }


  //LISTAR

  formGrupos = new FormGroup({
    descripcion: new FormControl<String>('', [Validators.required]),
    actividades: new FormControl<String>('', [Validators.required]),
    fecha: new FormControl<Date>(null, [Validators.required]),
    observacion: new FormControl<String>('', [Validators.required]),
    participantes: new FormControl<String>('', [Validators.required]),
  })

  formList = new FormGroup({
    valorSelect: new FormControl<String>('', [Validators.required]),
  })

  listarEventoSinParticipantes() {
    this.eventoService.getEventoSinParticipantes().subscribe(value => {
      this.eventoLista = value;
      console.log(value);
    })

  }



  cargarParticipantesCurso() {
    //this.selectedIdEvento = (id.target as HTMLSelectElement).value;
    this.selectedIdEvento = Object.values(this.formList.getRawValue())[0];

    for (var k = 0; k < this.eventoLista.length; k++) {
      if (this.eventoLista[k].id == this.selectedIdEvento) {
        this.formGrupos.setValue({
          actividades: this.eventoLista[k].actividades,
          descripcion: this.eventoLista[k].descripcion,
          fecha: this.eventoLista[k].fecha,
          observacion: this.eventoLista[k].observaciones,
          participantes: '',
        })
      }

    }
    this.divMostrar = true;
  }


  //editar

  guardarEditarEvento() {

    this.eventoListaGuardar.descripcion = Object.values(this.formGrupos.getRawValue())[0];
    this.eventoListaGuardar.actividades = Object.values(this.formGrupos.getRawValue())[1];
    this.eventoListaGuardar.fecha = Object.values(this.formGrupos.getRawValue())[2];
    this.eventoListaGuardar.observaciones = Object.values(this.formGrupos.getRawValue())[3];
    this.eventoListaGuardar.numParticipantes = Object.values(this.formGrupos.getRawValue())[4];
    this.eventoListaGuardar.usuarioid = "1";
    this.eventoListaGuardar.id = this.selectedIdEvento;

    console.log(this.eventoListaGuardar);

    try {
      if (this.eventoListaGuardar.documento.length != 0) {
        console.log("Datos Actualizar");
        console.log(this.eventoListaGuardar);
        this.eventoService.putEvento(this.eventoListaGuardar).subscribe(value => {
          this._snackBar.open('Evento Actualizado', 'ACEPTAR');
          this.listarEventoSinParticipantes();
          this.listarEventosParticipantes();
          this.mostrarLista();
          this.divMostrar = false;
        }, error => {
          this._snackBar.open(error.error.message, 'ACEPTAR');
          //this.loaderGuardar=false
        })
      }
    } catch (error) {


      this._snackBar.open('Seleccione un archivo', 'ACEPTAR');
    }
  }



  //convertir a base 64
  onFileSelected(event) {
    console.log(event);
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.base64Output = base64;
      this.eventoListaGuardar.documento = base64;
      console.log("Convertido a base 64");
    });
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }



  //listar en tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  listarEventosParticipantes() {
    this.eventoService.getEventoConParticipantes().subscribe(value => {
      console.log(value);
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      //this.loaderActualizar=false

    })
  }

  descargarDocumento(base64: any) {

    try {
      if (base64 == null) {
        this._snackBar.open('No existe un documento', 'ACEPTAR');
      } else {
        this.checkForMIMEType(base64);
      }
    } catch (error) {
      this._snackBar.open('Algo salio mal', 'ACEPTAR');
    }


  }

  checkForMIMEType(baseitem) {
    var response = baseitem;
    //console.log(response)
    var blob;
    if (response.mimetype == 'pdf') {

      blob = this.converBase64toBlob(response.content, 'application/pdf');
    } else if (response.mimetype == 'doc') {
      blob = this.converBase64toBlob(response.content, 'application/msword');
    }

    /* application/vnd.openxmlformats-officedocument.wordprocessingml.document */

    blob = this.converBase64toBlob(response, 'application/pdf');
    var blobURL = URL.createObjectURL(blob);
    window.open(blobURL);
  }

  converBase64toBlob(content, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = window.atob(content); //method which converts base64 to binary
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {
      type: contentType
    }); //statement which creates the blob
    return blob;
  }

}

