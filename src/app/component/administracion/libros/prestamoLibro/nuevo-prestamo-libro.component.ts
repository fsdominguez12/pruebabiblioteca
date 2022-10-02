import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from "@angular/material/table";
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormGroup } from '@angular/forms';
import { PersonaCliente } from 'src/app/models/personaCliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { libro, libroEstado, libroPrestamo, PrestamoLibro } from 'src/app/models/libro';
import { LibroService } from 'src/app/services/libro.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from "sweetalert2";



@Component({
  selector: 'app-nuevo-prestamo-libro',
  templateUrl: './nuevo-prestamo-libro.component.html',
  styleUrls: ['./nuevo-prestamo-libro.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class NuevaPrestamoLibroComponent implements OnInit {

  public mensajeSinParticiantes: any = "NO HAY PRÉSTAMO DE LIBROS"

  public clienteLista: PersonaCliente[] = [];
  public libroDisponibleLista: libro[] = [];
  public libroDisponibleListaRespaldo: libro[] = [];
  public libroClienteLista: libroPrestamo[] = [];
  public listaGuardarPrestamo: PrestamoLibro = new PrestamoLibro();
  public listaDevolverLibro: PrestamoLibro = new PrestamoLibro();
  public listaDatoLibroNuevo: libro = new libro();
  public libroDatoActualizar: libroEstado = new libroEstado();

  public idLibro: any;

  public idCliente: any;
  public cardLibro: any;
  public cardClienteMensaje: Boolean = true;
  public cardCliente: Boolean = false;
  public cardListarModulo: Boolean;
  public cardListarVacio: Boolean;

  public divNuevo: Boolean = true;
  public divListar: Boolean = false;


  formCliente: FormGroup;
  public Hoy = new Date();
  public FechaHoy = new Date();





  public dialogoCliente: boolean;
  public dialogoVerDatoCliente: boolean;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  isEditable = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private clienteService: ClienteService,
    private libroService: LibroService,) { }

  ngOnInit(): void {
    this.listarClientes();
    this.listarLibroDispo();
  }

  public mostrarLista() {
    this.divListar = true;
    this.divNuevo = false;
    this.listarClientesLibro();
  }

  public mostrarNuevo() {
    this.divListar = false;
    this.divNuevo = true;
  }

  prueba() {
    alert("aqui ta");
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
      // console.log(this.clienteLista);
      this.dataSourceCliente = new MatTableDataSource(value);
      this.dataSourceCliente.paginator = this.paginator;
      this.dataSourceCliente.sort = this.sort;

    })

  }

  secondFormGroup = this._formBuilder.group({
    cedula: new FormControl<String>('', [Validators.required]),
    nombres: new FormControl<String>('', [Validators.required]),
    edad: new FormControl<any>('', [Validators.required]),
    email: new FormControl<String>('', [Validators.required]),
    direccion: new FormControl<String>('', [Validators.required]),
    representante: new FormControl<String>('', [Validators.required]),
  });

  cargarDatosCliente(id: any) {

    this.vaciarFormulario();
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
  }

  vaciarFormulario() {
    this.prestamoLibroFormGroup.setValue({
      fechaEntrega: this.Hoy,
      fechaDev: "",

      observacion: "",
    })

  }


  //LIBRO




  prestamoLibroFormGroup = this._formBuilder.group({
    fechaEntrega: new FormControl<any>('', [Validators.required]),
    fechaDev: new FormControl<any>('', [Validators.required]),

    observacion: new FormControl<String>('', []),
  });


  displayedColumnsLibroDis: string[] = ['codigo'];
  dataSourceLibro = new MatTableDataSource<libro>;

  applyFilterLibroDisponible(event: Event) {
    const filterValueLibroDis = (event.target as HTMLInputElement).value;
    this.dataSourceLibro.filter = filterValueLibroDis.trim().toLowerCase();
  }



  listarLibroDispo() {


    this.libroService.getLibrosDisponibles().subscribe(value => {
      console.log("Listado libro Disponible generado exitosamente");
      this.libroDisponibleLista = value;
      console.log(this.libroDisponibleLista)


      this.dataSourceLibro = new MatTableDataSource(this.libroDisponibleLista);
      this.dataSourceLibro.paginator = this.paginator;
      this.dataSourceLibro.sort = this.sort;

    })
  }

  libroDispFormGroup = this._formBuilder.group({
    idLibroA: new FormControl<String>('', [Validators.required]),
    autor: new FormControl<String>('', [Validators.required]),
    nombreL: new FormControl<String>('', [Validators.required]),
    codigoLibro: new FormControl<String>('', [Validators.required]),
  })

  cargarDatosLibro(id: any) {
    this.idLibro = id;
    this.cardLibro = true;
    for (var i = 0; i < this.libroDisponibleLista.length; i++) {

      if (this.libroDisponibleLista[i].id == this.idLibro) {
        this.libroDispFormGroup.setValue({

          idLibroA: this.libroDisponibleLista[i].id,
          codigoLibro: this.libroDisponibleLista[i].codigoLibro.toUpperCase(),

          autor: this.libroDisponibleLista[i].autor.toUpperCase(),
          nombreL: this.libroDisponibleLista[i].nombre.toUpperCase(),



        })

        console.log("Datos computo cargado correctamente");
      }

    }
  }



  guardarPrestamoLibro() {
    this.listaGuardarPrestamo.idCliente = this.idCliente;
    this.listaGuardarPrestamo.fechaEntrega = Object.values(this.prestamoLibroFormGroup.getRawValue())[0];
    this.listaGuardarPrestamo.fechaDev = Object.values(this.prestamoLibroFormGroup.getRawValue())[1];
    this.listaGuardarPrestamo.idLibro = this.idLibro;
    this.listaGuardarPrestamo.observacionesEntrega = Object.values(this.prestamoLibroFormGroup.getRawValue())[2];

    if (Object.values(this.prestamoLibroFormGroup.getRawValue())[2].length == 0) {
      this.listaGuardarPrestamo.observacionesEntrega = "Sin observación";
    }

    this.libroService.createPrestamoLibro(this.listaGuardarPrestamo).subscribe(value => {
      console.log("REGISTRADO EXITOSAMENTE");
      this._snackBar.open('registrado exitosamente', 'ACEPTAR');
      this.vaciarFormulario();
      this.listarClientesLibro();
      this.mostrarLista();
      this.cardCliente = false;
      this.cardLibro = false;
      /*
      this.libroDatoActualizar.estado = true;
      this.libroDatoActualizar.id = this.listaGuardarPrestamo.idLibro;

      this.libroService.putLibro(this.libroDatoActualizar).subscribe(value => {
        this.listarLibroDispo();
        console.log("Libro cambiado a estado true");
      }, error => {
        this._snackBar.open(error.error.message, 'ACEPTAR');
      })*/

    }, error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');

    })

  }


  //listar tabla
  //LISTAR

  displayedColumns: string[] = ['id', 'libro', 'prestamo', 'cedula', 'cliente', 'telefono', 'devolucion', 'observacionn', 'boton'];
  dataSource: MatTableDataSource<libroPrestamo>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  listarClientesLibro() {

    this.libroService.getLibroCliente().subscribe(value => {
      console.log("Listado clientes  libro generado exitosamente");

      this.libroClienteLista = value;


      if (this.libroClienteLista.length > 0) {
        this.cardListarModulo = true;
        this.cardListarVacio = false;
      } else if (this.libroClienteLista.length == 0) {
        this.cardListarModulo = false;
        this.cardListarVacio = true;
      }

      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }), error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
    }

  }

  //DEVOLVER LIBRO

  devolucionLibro(id: any) {

    this.listaDevolverLibro.idPrestao = id;
    Swal.fire({
      title: "¿Quiere añadir una observación?",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      background: '#f7f2dc',
      confirmButtonColor: '#f47f16',
      cancelButtonColor: '#d33',
      backdrop: false
    })
      .then(resultado => {
        if (resultado.value) {

          Swal.fire({
            title: "Ingrese una observación",
            input: "text",

            inputAttributes: {
              autocapitalize: 'off'
            },

            showLoaderOnConfirm: true,

            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            background: '#f7f2dc',
            confirmButtonColor: '#a01b20',
            backdrop: false


          })
            .then(resultado => {
              if (resultado.value) {
                this.listaDevolverLibro.observacionesDev = resultado.value;
                this.guardarDatosDevolucionLibro();
              } else {
                this._snackBar.open("ERROR Debe de ingresar una observación", 'ACEPTAR');
              }
            });

        } else {
          this.listaDevolverLibro.observacionesDev = "Sin observación";
          this.guardarDatosDevolucionLibro();
        }
      })
  }

  guardarDatosDevolucionLibro() {

    for (var i = 0; i < this.libroClienteLista.length; i++) {
      if (this.libroClienteLista[i].idPrestamo == this.listaDevolverLibro.idPrestao) {

        this.listaDevolverLibro.observacionesEntrega = this.libroClienteLista[i].observacionEntrega;
        this.listaDevolverLibro.idLibro = this.libroClienteLista[i].idLIbro;
        this.listaDevolverLibro.fechaEntrega = new Date(String(this.libroClienteLista[i].anioPrestamo) + "-" + String(this.libroClienteLista[i].mesPrestamo) + "-" + String(this.libroClienteLista[i].diaPrestamo));
        this.listaDevolverLibro.fechaDev = new Date(String(this.libroClienteLista[i].anioDev) + "-" + String(this.libroClienteLista[i].mesDev) + "-" + String(this.libroClienteLista[i].diaDev));
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       
        this.listaDevolverLibro.idCliente = 2;


      }
    }


    console.log(this.listaDevolverLibro);


    this.libroService.putLibroDevolucion(this.listaDevolverLibro).subscribe(value => {
      this._snackBar.open('Se ha devuelto el libro exitosamente', 'ACEPTAR');
      /*
      this.libroDatoActualizar.estado = false;
      this.libroDatoActualizar.id = this.listaDevolverLibro.idLibro

      this.libroService.putLibro(this.libroDatoActualizar).subscribe(value => {
        this.listarLibroDispo();
        this.listarClientesLibro();
        console.log("Libro cambiado a estado false");
      }, error => {
        this._snackBar.open(error.error.message, 'ACEPTAR');
      })*/

    }, error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');

    })


  }

}

