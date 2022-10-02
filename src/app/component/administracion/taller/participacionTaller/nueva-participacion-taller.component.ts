
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from "@angular/material/table";
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormGroup } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';
import { PersonaCliente } from 'src/app/models/personaCliente';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TallerService } from 'src/app/services/taller.service';
import { Taller } from 'src/app/models/taller';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListaClientesRequests } from 'src/app/models/clienteCurso';
import Swal from "sweetalert2";


@Component({
  selector: 'app-nueva-participacion-taller',
  templateUrl: './nueva-participacion-taller.component.html',
  styleUrls: ['./nueva-participacion-taller.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class NuevaParticipacionTallerComponent implements OnInit {

  public mensajeNoHayDatos: any = "NO HAY TALLERES PARA AGREGAR PARTICIPANTES.";
  public mensajeSinParticiantes: any = "NO HAY PARTICIPANTES EN ESTE TALLER"

  //CLIENTE
  public clienteLista: PersonaCliente[] = [];

  public idCliente: any;
  public cardClienteMensaje: Boolean = true;
  public cardCliente: Boolean = false;

  //ojo borraar el true
  public controlbotonSiguiente: Boolean = true;
  public controlmensajeSiguiente: Boolean;

  public mensajeSinCupos: String = "SIN CUPOS"
  public mensajeSinCuposGuardar: String = "SIN CUPOS";

  //TALLER
  public listaInicialTaller: Taller[] = [];
  public tallerLista: Taller[] = [];
  public idTaller: any;


  //OTROS
  public Hoy = new Date();
  public divNuevo: Boolean = true;
  public divListar: Boolean = false;
  public cardListarModulo: Boolean;
  public cardListarVacio: Boolean;
  public listaClientesInscritos: ListaClientesRequests[];

  public selectedIdTaller: any;

  //CARDS
  public numeroCondicion: Number = 0;
  public cardTallerMensaje: Boolean = true;
  public cardTaller: Boolean = false;

  public cardValorCero: Boolean;
  public cardValorDifenteCero: Boolean;

  formCliente: FormGroup;

  public dialogoCliente: boolean;


  firstFormGroup1 = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup1 = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isEditable = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private tallerService: TallerService,
    private _snackBar: MatSnackBar,
  ) { }


  ngOnInit(): void {
    this.listarTaller();
    this.listarClientes();
  }

  prueba(valor: any) {
    alert(valor);
  }
  openDialog() {
    this.dialogoCliente = true;
  }

  closeDialog() {
    this.dialogoCliente = false;
  }


  public mostrarLista() {
    this.divListar = true;
    this.divNuevo = false;
    this.cardListarModulo = false;

    if (this.numeroCondicion == 0) {
      this.numeroCondicion = 2;
    } else {
      this.numeroCondicion = 1;
    }

    this.formList.setValue({
      valorSelect: '',

    })

  }

  public mostrarNuevo() {
    this.divListar = false;
    this.divNuevo = true;
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
      console.log(this.clienteLista);
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


  ///////////////////////////////////////////////////////////////////////////////////////////////////
  //TALLER

  displayedColumnsTaller: string[] = ['nombreTaller'];
  dataSourceTaller: MatTableDataSource<Taller>;


  applyFilterTaller(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTaller.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceTaller.paginator) {
      this.dataSourceTaller.paginator.firstPage();
    }
  }



  listarTaller() {
    this.tallerService.getAllTaller().subscribe(value => {
      this.listaInicialTaller = value;

      console.log(value);



      var AnyoHoy = this.Hoy.getFullYear();
      var MesHoy = this.Hoy.getMonth() + 1;
      var DiaHoy = this.Hoy.getDate();


      for (var i = 0; i < this.listaInicialTaller.length; i++) {

        let cadena = this.listaInicialTaller[i].fechaMaxInscripcion;
        let palabra = cadena.split('-')

        var AnyoFecha = palabra[0];
        var MesFecha = palabra[1];
        var DiaFecha = palabra[2];


        //console.log(DiaFecha);

        if (AnyoFecha < AnyoHoy) {

        }
        else {
          if (AnyoFecha == AnyoHoy && MesFecha < MesHoy) {

          }
          else {
            if (AnyoFecha == AnyoHoy && MesFecha == MesHoy && DiaFecha < DiaHoy) {

            }
            else {
              if (AnyoFecha == AnyoHoy && MesFecha == MesHoy && DiaFecha == DiaHoy) {

                this.tallerLista.push(this.listaInicialTaller[i]);
              }
              else {

                this.tallerLista.push(this.listaInicialTaller[i]);

              }
            }
          }
        }



      }

      if (this.tallerLista.length == 0) {
        this.cardValorCero = true;
        this.cardValorDifenteCero = false;

      } else {
        this.cardValorCero = false;
        this.cardValorDifenteCero = true;
      }


      this.dataSourceTaller = new MatTableDataSource(this.tallerLista);
      this.dataSourceTaller.paginator = this.paginator;
      this.dataSourceTaller.sort = this.sort;
      console.log("Listado talleres generado exitosamente");
      console.log(this.tallerLista)
    })



  }


  firstFormGroup = this._formBuilder.group({
    disponibilidad: new FormControl<String>('', [Validators.required]),
    nombre: new FormControl<String>('', [Validators.required]),
    responsable: new FormControl<String>('', [Validators.required]),
    fechaInicioFin: new FormControl<String>('', [Validators.required]),
    lugar: new FormControl<String>('', [Validators.required]),
    descripcion: new FormControl<String>('', [Validators.required]),
  });


  cargarDatosTaller(inscritos: any) {

    if (this.numeroCondicion == 1) {
      this.cardTallerMensaje = false;
      this.cardTaller = true;
    } else {
      if (this.numeroCondicion == 2) {
        this.cardTallerMensaje = false;
        this.cardTaller = false;
      }
    }



    for (var i = 0; i < this.tallerLista.length; i++) {
      if (this.tallerLista[i].idTaller == this.idTaller) {

        this.firstFormGroup.setValue({
          disponibilidad: inscritos,
          nombre: this.tallerLista[i].nombre.toUpperCase(),
          responsable: this.tallerLista[i].responsable.toUpperCase(),
          fechaInicioFin: this.tallerLista[i].fechaInicio + " hasta " + this.tallerLista[i].fechaFin,
          lugar: this.tallerLista[i].lugar.toUpperCase(),
          descripcion: this.tallerLista[i].descripcion.toUpperCase(),
        })

        console.log("Datos taller cargado correctamente");
      }

    }
  }

  contarTallerCurso(id: any, condicion: Number) {
    this.numeroCondicion = condicion;
    this.idTaller = id;

    this.tallerService.getContarTaller(this.idTaller).subscribe(value => {
      this.cargarDatosTaller(Object.values(value)[0]);
    })

  }


  //GUARDAR INSCRIPCION EN LA BASE

  guardarclienteTaller() {
    this.tallerService.saveClienteTaller(this.idCliente, this.idTaller).subscribe(
      Response => {
        console.log("Cliente inscrito con exito");
        this.contarTallerCurso(this.idTaller, 1);
        this._snackBar.open("Cliente inscrito con exito", "CERRAR");

      }, error => {
        this._snackBar.open(error.error.message, 'ACEPTAR');
      }

    )

  }



  //LISTAR CLIENTE CON BOTON NARANJA
  displayedColumns: string[] = ['position', 'cedula', 'nombres', 'apellidos', 'eliminar'];
  dataSource = new MatTableDataSource<ListaClientesRequests>;

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  formList = new FormGroup({
    valorSelect: new FormControl<String>('', [Validators.required]),
  })


  listarParticipantesTaller(condicion: number, valor: any) {


    if (condicion == 1) {
      this.selectedIdTaller = Object.values(this.formList.getRawValue())[0];
    } else {
      if (condicion == 2) {
        this.selectedIdTaller = valor;
      }
    }


    this.cardListarModulo = true;

    this.tallerService.getClientesTaller(this.selectedIdTaller).subscribe(values => {

      console.log("listado clientes taller generado y listado en table");
      console.log(Object.values(values)[9]);

      var quesirva = JSON.stringify(Object.values(values)[9])
      var coche = JSON.parse(quesirva);
      this.listaClientesInscritos = coche;

      if (this.listaClientesInscritos.length > 0) {
        this.cardListarModulo = true;
        this.cardListarVacio = false;
      } else if (this.listaClientesInscritos.length == 0) {
        this.cardListarModulo = false;
        this.cardListarVacio = true;
      }


      this.dataSource = new MatTableDataSource(this.listaClientesInscritos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    })
  }


  eliminarClienteCurso(idCliente: any) {

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
          this.tallerService.deletePersonaTalller(idCliente, this.selectedIdTaller).subscribe(value => {
            this.listarParticipantesTaller(2, this.selectedIdTaller);
            //this.contarClientesCurso(this.selectedIdCurso, this.numeroCondicion);
            this.contarTallerCurso(this.selectedIdTaller, this.numeroCondicion);
            this._snackBar.open('Eliminado exitosamente', 'ACEPTAR');

          }, error => {
            this._snackBar.open(error.error.message, 'ACEPTAR');
          })
        }
      });



  }


}

