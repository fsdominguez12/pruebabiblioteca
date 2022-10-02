import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PersonaCliente } from 'src/app/models/personaCliente';
import { ServicioClienteVarios, ServiciosVarios, ServicioVariosClienteTabla } from 'src/app/models/ServiciosVarios';
import { ClienteService } from 'src/app/services/cliente.service';
import { serviciosVariosService } from 'src/app/services/servicios-varios.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-usoServicioVarios',
  templateUrl: './usoServicioVarios.component.html',
  styleUrls: ['./usoServicioVarios.component.css'],


})

export class usoServicioVariosComponent implements OnInit {

  public divNuevo: Boolean = true;
  public divListar: Boolean = false;

  public dialogoCliente: boolean;


  public clienteLista: PersonaCliente[] = [];
  public servicioLista: ServiciosVarios[] = [];
  public servicioClienteListaGuardar: ServicioClienteVarios = new ServicioClienteVarios();

  public clienteServicioVarioLista: ServicioVariosClienteTabla[] = [];

  public idCliente: any;
  public idPrestamoCI: any;
  public cardClienteMensaje: Boolean = true;
  public cardCliente: Boolean = false;

  public Hoy = new Date();

  formCliente: FormGroup;


  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  isEditable = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private clienteService: ClienteService,
    private servicioVariosService: serviciosVariosService,
  ) {

  }

  ngOnInit(): void {
    this.listarClientes();
    this.listarServiciosVarios();
  }


  public mostrarLista() {
    this.divListar = true;
    this.divNuevo = false;
    this.listarClientesServiVario();
  }

  public mostrarNuevo() {
    this.divListar = false;
    this.divNuevo = true;
  }


  openDialog() {
    this.dialogoCliente = true;
  }

  closeDialog() {
    this.dialogoCliente = false;
  }

  //////////////////////
  //CLIENTE

  //LISTAR CLIENTE CON BOTON NARANJA
  displayedColumnsCliente: string[] = ['cedula'];
  dataSourceCliente = new MatTableDataSource<PersonaCliente>;

  //FILTRO DE BUSQUEDA
  applyFilterCliente(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCliente.filter = filterValue.trim().toLowerCase();
  }

  listarClientes() {
    this.clienteService.getAllClientes().subscribe(value => {
      console.log("Listado clientes generado exitosamente");
      this.clienteLista = value;
      this.dataSourceCliente = new MatTableDataSource(value);
      this.dataSourceCliente.paginator = this.paginator;
      this.dataSourceCliente.sort = this.sort;

    })

  }


  cargarDatosCliente(id: any) {
    this.idCliente = id;
    this.cardCliente = true;
    this.cardClienteMensaje = false;
    for (var i = 0; i < this.clienteLista.length; i++) {

      if (this.clienteLista[i].idCliente == this.idCliente) {
        this.secondFormGroup.setValue({

          cedula: this.clienteLista[i].cedula,
          nombres: this.clienteLista[i].nombres.toUpperCase() + " " + this.clienteLista[i].apellidos.toUpperCase(),
          edad: this.clienteLista[i].edad,
          email: this.clienteLista[i].email,
          direccion: this.clienteLista[i].barrio.toUpperCase() + " - " + this.clienteLista[i].parroquia.toUpperCase(),
          representante: this.clienteLista[i].nombreResponsable.toUpperCase(),


        })

        console.log("Datos cliente cargado correctamente");
      }

    }

    this.formGroupImpresion.setValue({
      fecha: this.Hoy,
      color: "",
      observaciones: "",
    })
  }

  formGroupImpresion = this._formBuilder.group({
    fecha: new FormControl<any>('', [Validators.required]),
    color: new FormControl<any>('', [Validators.required, Validators.max(500)]),
    observaciones: new FormControl<String>('', []),
  })



  secondFormGroup = this._formBuilder.group({
    cedula: new FormControl<String>('', [Validators.required]),
    nombres: new FormControl<String>('', [Validators.required]),
    edad: new FormControl<any>('', [Validators.required]),
    email: new FormControl<String>('', [Validators.required]),
    direccion: new FormControl<String>('', [Validators.required]),
    representante: new FormControl<String>('', [Validators.required]),
  });



  //listar servicios varios

  listarServiciosVarios() {

    this.servicioVariosService.getServicioVarios().subscribe(value => {
      this.servicioLista = value;
    })


  }


  guardarImpresion() {
    this.cargaDatosParaService();
    this.servicioVariosService.createServicioVariosCliente(this.servicioClienteListaGuardar).subscribe(value => {
      this._snackBar.open('Impresión Copia creado', 'ACEPTAR');
      this.vaciarFormulario();
      this.cardCliente = false;
      //this.listarClientesImpresion();
      this.mostrarLista();

    }, error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
      //this.loaderGuardar=false
    })
  }

  cargaDatosParaService() {

    this.servicioClienteListaGuardar.idCliente = this.idCliente;
    this.servicioClienteListaGuardar.fechaActual = Object.values(this.formGroupImpresion.getRawValue())[0];
    this.servicioClienteListaGuardar.idServicioVario = Object.values(this.formGroupImpresion.getRawValue())[1];
    this.servicioClienteListaGuardar.observaciones = Object.values(this.formGroupImpresion.getRawValue())[2];

    if (this.servicioClienteListaGuardar.observaciones == 0) {
      this.servicioClienteListaGuardar.observaciones = "Sin observación";
    }
    console.log(this.servicioClienteListaGuardar);
  }


  vaciarFormulario() {
    this.formGroupImpresion.setValue({
      fecha: this.Hoy,
      color: "",
      observaciones: "",
    })
  }



  //listar

  //LISTAR

  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'color', 'fecha', 'observacion', 'documento'];
  dataSource: MatTableDataSource<ServicioVariosClienteTabla>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  listarClientesServiVario() {
    var AnyoHoy = this.Hoy.getFullYear();
    var MesHoy = this.Hoy.getMonth() + 1;

    this.servicioVariosService.getServicioVariosCliente(MesHoy, AnyoHoy).subscribe(value => {
      console.log("Listado clientes varios generado exitosamente");
      this.clienteServicioVarioLista = value;
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }), error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
    }

  }


  abrirEditar(id: any) {

    Swal.fire({
      title: "Ingrese observación",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      background: '#f7f2dc',
      confirmButtonColor:'#a01b20',
      backdrop: false
    })
      .then(resultado => {
        if (resultado.value) {

          let dato:ServicioClienteVarios = new ServicioClienteVarios();
          dato.id =id;
          dato.observaciones = resultado.value;

          this.servicioVariosService.putServicioVariosCliente(dato).subscribe(value => {
            this.listarClientesServiVario();
            this._snackBar.open('Observación modificado', 'ACEPTAR');
          },error => {
            this._snackBar.open(error.error.message, 'ACEPTAR');
          })

         
        }
      });

  }
}