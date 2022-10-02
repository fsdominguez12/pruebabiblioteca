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
import { LibroService } from 'src/app/services/libro.service';
import { libro } from 'src/app/models/libro';

pdfMake.vfs = pdfFonts.pdfMake.vfs;



@Component({
  selector: 'app-crudlibro',
  templateUrl: './crudlibro.component.html',
  styleUrls: ['./crudlibro.component.css']
})
export class CrudLibroComponent implements OnInit {

  public mensajeSinParticiantes: any = "ACTUALMENTE NO HAY LIBROS"

  public eventoListaGuardar: Evento = new Evento();
  public libroListaGuardar: libro = new libro();

  public idLibro: any;

  public libroLista: libro[] = [];

  public estadoLibro: any;
  public datoisbn: any;

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
    public libroService: LibroService,
    private _snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.listarLibros();
  }


  public mostrarLista() {
    this.listarLibros();
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
    codigo: new FormControl<String>('', [Validators.required]),
    nombre: new FormControl<String>('', [Validators.required]),
    isbn: new FormControl<String>('', []),
    autor: new FormControl<String>('', [Validators.required]),
  })

  guardarLibro() {

    var isbnxd;

    if (Object.values(this.formGrupos.getRawValue())[2].length == 0) {
      isbnxd = "SIN ISBN";
    } else {
      isbnxd = Object.values(this.formGrupos.getRawValue())[2];
    }


    this.libroListaGuardar.codigoLibro = Object.values(this.formGrupos.getRawValue())[0];
    this.libroListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[1];
    this.libroListaGuardar.isbn = isbnxd;
    this.libroListaGuardar.autor = Object.values(this.formGrupos.getRawValue())[3];
    this.libroListaGuardar.estado = false;


    console.log("Libro Guardado");
    console.log(this.libroListaGuardar);

    this.libroService.createLibro(this.libroListaGuardar).subscribe(value => {
      this._snackBar.open('Libro registrado', 'ACEPTAR');
      this.vaciarFormulario();
      this.listarLibros();
      this.mostrarLista();
    }, error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');

    })



  }

  vaciarFormulario() {
    this.formGrupos.setValue({

      codigo: "",
      nombre: "",
      isbn: "",
      autor: "",

    })
  }


  displayedColumnsTaller: string[] = ['id', 'codigo', 'nombre', 'autor', 'isbn', 'estado', 'editar'];
  dataSourceEvento: MatTableDataSource<Evento>;


  applyFilterEvento(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEvento.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceEvento.paginator) {
      this.dataSourceEvento.paginator.firstPage();
    }
  }

  listarLibros() {

    this.libroService.getLibrosAll().subscribe(value => {

      this.libroLista = value;

      if (this.libroLista.length > 0) {
        this.cardListarModulo = true;
        this.cardListarVacio = false;
      } else if (this.libroLista.length == 0) {
        this.cardListarModulo = false;
        this.cardListarVacio = true;
      }


      this.dataSourceEvento = new MatTableDataSource(this.libroLista);
      this.dataSourceEvento.paginator = this.paginator;
      this.dataSourceEvento.sort = this.sort;
      console.log("Listado libros generado exitosamente");
      console.log(this.libroLista)
    })

  }

  //EDITAR

  editarLibro(id: any, estado: any) {
    this.idLibro = id;
    this.estadoLibro = estado;
    this.botonParaGuardar = false;
    this.botonParaEditar = true;


    for (var k = 0; k < this.libroLista.length; k++) {
      if (this.libroLista[k].id == id) {
        this.formGrupos.setValue({

          codigo: this.libroLista[k].codigoLibro,
          nombre: this.libroLista[k].nombre,
          isbn: this.libroLista[k].isbn,
          autor: this.libroLista[k].autor,

        })
        this.mostrarNuevo();
        this.numeroControl = 3;
      }

    }
  }

  isbnControler() {

    if (Object.values(this.formGrupos.getRawValue())[2].length == 0) {
      this.datoisbn = "SIN ISBN";
    } else {
      this.datoisbn = Object.values(this.formGrupos.getRawValue())[2];
    }
  }

  guardarEditarLibro() {

    var isbnguardar;

    if (Object.values(this.formGrupos.getRawValue())[2].length == 0) {
      isbnguardar = "SIN ISBN";
    } else {
      isbnguardar = Object.values(this.formGrupos.getRawValue())[2];
    }

    this.libroListaGuardar.codigoLibro = Object.values(this.formGrupos.getRawValue())[0];
    this.libroListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[1];
    this.libroListaGuardar.isbn = isbnguardar;
    this.libroListaGuardar.autor = Object.values(this.formGrupos.getRawValue())[3];
    this.libroListaGuardar.estado = this.estadoLibro;
    this.libroListaGuardar.id = this.idLibro;


    console.log("Datos Actualizar");
    console.log(this.libroListaGuardar);

    this.libroService.putLibroTodo(this.libroListaGuardar).subscribe(value => {
      this._snackBar.open('Libro Actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonParaGuardar = true;
      this.botonParaEditar = false;
      this.listarLibros();
      this.mostrarLista();
    }, error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
      //this.loaderGuardar=false
    })


  }



}

