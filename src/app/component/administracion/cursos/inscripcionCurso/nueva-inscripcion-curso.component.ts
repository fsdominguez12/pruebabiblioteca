import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from "@angular/material/table";
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormGroup, FormControl } from '@angular/forms';
import { CursoService } from 'src/app/services/curso.service';
import { ContarNumeroClass, Curso } from 'src/app/models/curso';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { __values } from 'tslib';
import { ClienteService } from 'src/app/services/cliente.service';
import { PersonaCliente } from 'src/app/models/personaCliente';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ListaClientesRequests } from 'src/app/models/clienteCurso';
import Swal from "sweetalert2";

@Component({
  selector: 'app-nueva-inscripcion-curso',
  templateUrl: './nueva-inscripcion-curso.component.html',
  styleUrls: ['./nueva-inscripcion-curso.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class NuevaInscripcionComponent implements OnInit {

  public mensajeSinCupos: String = "SIN CUPOS"
  public mensajeSinCuposGuardar: String = "SIN CUPOS";
  public colorDisponibilidad: String = 'red';
  public fondoDisponibilidad: String = '#f1ebd4';
  public numeroCondicion: Number = 0;
  public totalCuposSobrantes: Number;
  public totalCuposTotal: any;
  public mensajeNoHayDatos: any = "NO HAY CURSOS PARA INSCRIBIR PARTICIPANTES. ";
  public mensajeSinParticiantes:any = "NO HAY PARTICIPANTES EN ESTE CURSO"

  //DECLARACIÓN DE VARIABLES
  public cursoLista: Curso[] = [];
  public clienteLista: PersonaCliente[] = [];
  public listaInicialCurso: Curso[] = [];
  public clientesListaCurso: ListaClientesRequests[] = [];
  //public contarLista: ContarNumeroClass[] = [];

  public formCliente: FormGroup;
  public dialogoCliente: boolean;

  public idCurso: any;
  public idCliente: any;

  public isEditable = true;
  public cardCursoMensaje: Boolean = true;
  public cardCurso: Boolean = false;
  public cardClienteMensaje: Boolean = true;
  public cardCliente: Boolean = false;
  public divNuevo: Boolean = true;
  public divListar: Boolean = false;
  public cardListarModulo: Boolean;
  public cardListarVacio: Boolean;

  public cardValorCero: Boolean;
  public cardValorDifenteCero: Boolean;

  public controlbotonSiguiente: Boolean;
  public controlmensajeSiguiente: Boolean;

  public numeroInscritos: Number;

  public Hoy = new Date();

  public selectedIdCurso: any;

  public listaClientesInscritos: ListaClientesRequests[];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private cursoService: CursoService,
    private clienteService: ClienteService,
  ) { }

  ngOnInit(): void {
    this.listarCursos();
    this.listarClientes();
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
  //FormGroup

  firstFormGroup = this._formBuilder.group({
    disponibilidad: new FormControl<String>('', [Validators.required]),
    nombre: new FormControl<String>('', [Validators.required]),
    responsable: new FormControl<String>('', [Validators.required]),
    fechaInicioFin: new FormControl<String>('', [Validators.required]),
    lugar: new FormControl<String>('', [Validators.required]),
    descripcion: new FormControl<String>('', [Validators.required]),
  });


  secondFormGroup = this._formBuilder.group({
    cedula: new FormControl<String>('', [Validators.required]),
    nombres: new FormControl<String>('', [Validators.required]),
    edad: new FormControl<any>('', [Validators.required]),
    email: new FormControl<String>('', [Validators.required]),
    direccion: new FormControl<String>('', [Validators.required]),
    representante: new FormControl<String>('', [Validators.required]),
  });






  //LISTAR SERVICIOS
  listarCursos() {
    this.cursoService.getAllCurso().subscribe(value => {
      this.listaInicialCurso = value;



      var AnyoHoy = this.Hoy.getFullYear();
      var MesHoy = this.Hoy.getMonth() + 1;
      var DiaHoy = this.Hoy.getDate();

      console.log(MesHoy)

      for (var i = 0; i < this.listaInicialCurso.length; i++) {
        //alert(this.listaInicialCurso[i].fechaMaxInscripcion);

        let cadena = this.listaInicialCurso[i].fechaMaxInscripcion;
        let palabra = cadena.split('-')

        var AnyoFecha = palabra[0];
        var MesFecha = palabra[1];
        var DiaFecha = palabra[2];


        //console.log(DiaFecha);

        if (AnyoFecha < AnyoHoy) {
          alert("La fecha introducida es anterior a Hoy");


        }
        else {
          if (AnyoFecha == AnyoHoy && MesFecha < MesHoy) {

          }
          else {
            if (AnyoFecha == AnyoHoy && MesFecha == MesHoy && DiaFecha < DiaHoy) {

            }
            else {
              if (AnyoFecha == AnyoHoy && MesFecha == MesHoy && DiaFecha == DiaHoy) {

                this.cursoLista.push(this.listaInicialCurso[i]);
              }
              else {

                this.cursoLista.push(this.listaInicialCurso[i]);

              }
            }
          }
        }



      }


      if (this.cursoLista.length == 0) {
        this.cardValorCero = true;
        this.cardValorDifenteCero = false;

      } else {
        this.cardValorCero = false;
        this.cardValorDifenteCero = true;
      }


      this.dataSourceCurso = new MatTableDataSource(this.cursoLista);
      this.dataSourceCurso.paginator = this.paginator;
      this.dataSourceCurso.sort = this.sort;
      console.log("Listado cursos generado exitosamente");
      console.log(this.cursoLista)
    })

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


  contarClientesCurso(id: any, condicion: Number) {
    this.numeroCondicion = condicion;
    this.idCurso = id;
    this.cursoService.getContarCurso(this.idCurso).subscribe(value => {
      this.cargarDatosCurso(Object.values(value)[0]);
    })


  }


  //CARGAR INFORMACION EN LOS INPUT
  cargarDatosCurso(inscritos: any) {

    if (this.numeroCondicion == 1) {
      this.cardCursoMensaje = false;
      this.cardCurso = true;
    } else {
      if (this.numeroCondicion == 2) {
        this.cardCursoMensaje = false;
        this.cardCurso = false;
      }
    }



    for (var i = 0; i < this.cursoLista.length; i++) {
      if (this.cursoLista[i].idCurso == this.idCurso) {

        this.totalCuposSobrantes = parseInt(this.cursoLista[i].numParticipantes) - parseInt(inscritos);


        if (this.totalCuposSobrantes <= 0) {
          this.controlbotonSiguiente = false;
          this.controlmensajeSiguiente = true;
          this.colorDisponibilidad = "red";
          this.fondoDisponibilidad = "#f1ebd4";

        } else {
          this.controlbotonSiguiente = true;
          this.controlmensajeSiguiente = false;
          this.colorDisponibilidad = "black";
          this.fondoDisponibilidad = "#f7f2dc";
        }

        this.firstFormGroup.setValue({
          disponibilidad: inscritos + "/" + this.cursoLista[i].numParticipantes,
          nombre: this.cursoLista[i].nombre.toUpperCase(),
          responsable: this.cursoLista[i].responsable.toUpperCase(),
          fechaInicioFin: this.cursoLista[i].fechaInicio + " hasta " + this.cursoLista[i].fechaFin,
          lugar: this.cursoLista[i].lugar.toUpperCase(),
          descripcion: this.cursoLista[i].descripcion.toUpperCase(),
        })

        console.log("Datos curso cargado correctamente");
      }

    }


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
  }


  //GUARDAR INSCRIPCION EN LA BASE

  guardarclienteCurso() {

    this.cursoService.saveClienteCurso(this.idCliente, this.idCurso).subscribe(
      Response => {
        console.log("Cliente inscrito con exito");
        this.contarClientesCurso(this.idCurso, 1);
        this._snackBar.open("Cliente inscrito con exito", "CERRAR");
        var num = this.totalCuposSobrantes;
        this.totalCuposTotal = Number(num) - 1;

        if (this.totalCuposTotal <= 0) {
          location.reload();
        }
      }, error => {
        this._snackBar.open(error.error.message, 'ACEPTAR');
      }

    )

  }


  //DIALOGO PARA CREAR UN NUEVO CLIENTE
  openDialog() {
    this.dialogoCliente = true;
  }





  //LISTAR CURSOS EN TABLA CON BOTON NARANJA

  displayedColumnsCurso: string[] = ['nombre'];
  dataSourceCurso: MatTableDataSource<Curso>;

  applyFilterCurso(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCurso.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceCurso.paginator) {
      this.dataSourceCurso.paginator.firstPage();
    }
  }

  //LISTAR CLIENTE CON BOTON NARANJA
  displayedColumnsCliente: string[] = ['cedula'];
  dataSourceCliente = new MatTableDataSource<PersonaCliente>;


  //FILTRO DE BUSQUEDA
  applyFilterCliente(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCliente.filter = filterValue.trim().toLowerCase();
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  //LISTAR Y ELIMINAR
  displayedColumns: string[] = ['position', 'cedula', 'nombres', 'apellidos', 'eliminar'];
  dataSource = new MatTableDataSource<ListaClientesRequests>;

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  formList = new FormGroup({
    valorSelect: new FormControl<String>('', [Validators.required]),
  })

  listarParticipantesCurso(condicion: number, valor: any) {


    if (condicion == 1) {
      this.selectedIdCurso = Object.values(this.formList.getRawValue())[0];
    } else {
      if (condicion == 2) {
        this.selectedIdCurso = valor;
      }
    }



    this.cursoService.getClientesCurso(this.selectedIdCurso).subscribe(values => {


      var quesirva = JSON.stringify(Object.values(values)[12])
      var coche = JSON.parse(quesirva);
      this.listaClientesInscritos = coche;


      if (this.listaClientesInscritos.length > 0) {
        this.cardListarModulo = true;
        this.cardListarVacio = false;
      }else if (this.listaClientesInscritos.length == 0){
        this.cardListarModulo = false;
        this.cardListarVacio = true;
      }

      this.dataSource = new MatTableDataSource(this.listaClientesInscritos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      //console.log(this.listaClientesInscritos.length);


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
          this.cursoService.deletePersonaCurso(idCliente, this.selectedIdCurso).subscribe(value => {
            this.listarParticipantesCurso(2, this.selectedIdCurso);
            this.contarClientesCurso(this.selectedIdCurso, this.numeroCondicion);
            this._snackBar.open('Eliminado exitosamente', 'ACEPTAR');

          }, error => {
            this._snackBar.open(error.error.message, 'ACEPTAR');
          })
        }
      });

    /*
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.cursoService.deletePersonaCurso(idCliente, this.selectedIdCurso).subscribe(value => {
        this.listarParticipantesCurso(this.selectedIdCurso, 2, this.selectedIdCurso);
        this.contarClientesCurso(this.selectedIdCurso);
        this._snackBar.open('Elimindo exitosamente', 'ACEPTAR');

      }, error => {
        this._snackBar.open(error.error.message, 'ACEPTAR');
      })
    }
  })*/


  }
}
