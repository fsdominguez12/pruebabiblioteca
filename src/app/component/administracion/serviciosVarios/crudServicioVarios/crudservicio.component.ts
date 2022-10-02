import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServiciosVarios } from 'src/app/models/ServiciosVarios';
import { serviciosVariosService } from 'src/app/services/servicios-varios.service';


@Component({
  selector: 'app-crudservicio.component',
  templateUrl: './crudservicio.component.html',
  styleUrls: ['./crudservicio.component.css'],
})

export class crudServicioVariosComponent implements OnInit {

  public mensajeSinParticiantes: any = "ACTUALMENTE NO EXISTEN SERVICIOS VARIOS"

  public servicioListaGuardar: ServiciosVarios = new ServiciosVarios();

  public servicioLista: ServiciosVarios[] = [];


  public divNuevo: Boolean = true;
  public divListar: Boolean = false;
  public cardListarModulo: Boolean;
  public botonParaGuardar: Boolean = true;
  public botonParaEditar: Boolean = false;
  public cardListarVacio: Boolean;


  public numeroControl: number = 1;
  public idServicio:any;


  ngOnInit(): void {
    this.listarServiciosVarios();
  }


  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private servicioVariosService: serviciosVariosService,
    private _snackBar: MatSnackBar,
  ) {

  }

  displayedColumnsTaller: string[] = ['id',  'descripcion',  'editar'];
  dataSourceEvento: MatTableDataSource<ServiciosVarios>;


  formGrupos = new FormGroup({
    descripcion: new FormControl<String>('', [Validators.required]),

  })


  public mostrarLista() {
    this.listarServiciosVarios();
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

  //listar

  applyFilterEvento(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEvento.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceEvento.paginator) {
      this.dataSourceEvento.paginator.firstPage();
    }
  }


  listarServiciosVarios() {

    this.servicioVariosService.getServicioVarios().subscribe(value => {
     
      this.servicioLista = value;

      if (this.servicioLista.length > 0) {
        this.cardListarModulo = true;
        this.cardListarVacio = false;
      } else if (this.servicioLista.length == 0) {
        this.cardListarModulo = false;
        this.cardListarVacio = true;
      }


      this.dataSourceEvento = new MatTableDataSource(this.servicioLista);
      this.dataSourceEvento.paginator = this.paginator;
      this.dataSourceEvento.sort = this.sort;
      console.log("Listado servicio varios generado exitosamente");
      //console.log(this.servicioLista)
    })


  }

  //guardar


  guardarServicioVario() {

    this.servicioListaGuardar.descripcion = Object.values(this.formGrupos.getRawValue())[0];

    console.log("Servicio Guardado");
    this.servicioVariosService.createServicioVarios(this.servicioListaGuardar).subscribe(value => {
      this._snackBar.open('Servicio registrado', 'ACEPTAR');
      this.vaciarFormulario();
      //this.listarServiciosVarios();
      this.mostrarLista();
    }, error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
      //this.loaderGuardar=false
    })


  }

  vaciarFormulario() {
    this.formGrupos.setValue({
      descripcion: "",
    })
  }



  //EDITAR


  editarServicio(id: any){

    this.idServicio = id;
    this.botonParaGuardar = false;
    this.botonParaEditar = true;

    for (var k = 0; k < this.servicioLista.length; k++) {
      if (this.servicioLista[k].id == id) {

        this.formGrupos.setValue({
          descripcion: this.servicioLista[k].descripcion,  
        })

        this.mostrarNuevo();
        this.numeroControl = 3;
      }

    }

  }

  guardarEditarServicio() {
    this.servicioListaGuardar.descripcion = Object.values(this.formGrupos.getRawValue())[0];
   
    this.servicioListaGuardar.id = this.idServicio;
    console.log("Datos Actualizar");
  
this.servicioVariosService.putServicioVarios(this.servicioListaGuardar).subscribe(value => {
      this._snackBar.open('Servicio Actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonParaGuardar = true;
      this.botonParaEditar = false;
      this.listarServiciosVarios();
      this.mostrarLista();
    }, error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
      //this.loaderGuardar=false
    })

  }
}