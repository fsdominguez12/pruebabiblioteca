import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Curso} from "../../../../models/curso";
import {CursoService} from "../../../../services/curso.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];

@Component({
  selector: 'app-crudcurso',
  templateUrl: './crudcurso.component.html',
  styleUrls: ['./crudcurso.component.css']
})
export class CrudcursoComponent implements OnInit {

  loaderGuardar: boolean;
  loaderActualizar: boolean;
  cursos: Curso[] = []
  selected = new FormControl(0);

  displayedColumns: string[] = ['id', 'nombre', 'lugar', 'responsable', 'fechaInicio', 'fechaFin', 'Editar'];
  dataSource: MatTableDataSource<Curso>;


  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(private cursoService: CursoService,
              private _snackBar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit(): void {
    this.listarCursos();
  }

  ngAfterViewInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  listarCursos() {
    this.loaderActualizar=true
    this.cursoService.getAllCurso().subscribe(value => {
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loaderActualizar = false

    })
  }

  formGrupos = new FormGroup({
    id: new FormControl<Number>(null),
    idCurso: new FormControl<Number>(0),
    nombre: new FormControl<String>('', [Validators.required, Validators.maxLength(20)]),
    responsable: new FormControl<String>('', [Validators.required]),
    actividades: new FormControl<String>('', [Validators.required]),

    numParticipantes: new FormControl<Number>(null, [Validators.required, Validators.pattern("[0-9]+")]),
    lugar: new FormControl<String>('', [Validators.required]),
    descripcion: new FormControl<String>('', [Validators.required]),
    materiales: new FormControl<String>('', [Validators.required]),
    //observaciones: new FormControl<String>('', [Validators.required]),
    fechaInicio: new FormControl<Date | null>(null, [Validators.required]),
    fechaFin: new FormControl<Date | null>(null, [Validators.required]),
    fechaMaxInscripcion: new FormControl<Date | null>(null, [Validators.required]),
  })


  borrarCursos() {

    console.log(document.getElementById("idCurso").innerText);
    this.cursoService.deleteCurso(+document.getElementById("idCurso").innerText).subscribe(value => {
      this._snackBar.open('Curso eliminado', 'ACEPTAR');
      this.vaciarFormulario()

      this.loaderGuardar = false
    }, error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
      this.loaderGuardar = false
    });


  }


  guardarCliente() {
    this.loaderGuardar=true;
    if (this.formGrupos.getRawValue().id==null){
      this.cursoService.createCurso(this.formGrupos.getRawValue()).subscribe(value => {
        this._snackBar.open('Curso registrado', 'ACEPTAR');
        this.selected.setValue(2)
        this.listarCursos()
        this.vaciarFormulario()
        this.loaderGuardar = false
      }, error => {
        this._snackBar.open(error.error.message, 'ACEPTAR');
        this.loaderGuardar = false
      })
    }else {
      this.cursoService.updateCurso(this.formGrupos.getRawValue()).subscribe(value => {
        this._snackBar.open('Curso actualizado', 'ACEPTAR');
        this.selected.setValue(2)
        this.listarCursos()
        this.vaciarFormulario()
        this.loaderGuardar = false
      },error => {
        this._snackBar.open(error.error.message, 'ACEPTAR');
        this.loaderGuardar=false

      })
    }

  }

  actualizarCursos(id:Number){
    this.vaciarFormulario()
    this.selected.setValue(0)
    this.loaderGuardar=true;
    this.cursoService.getAllCurso().subscribe(value =>{
      var curso: Curso=value.filter(value1 => value1.id==id)[0];
      this.formGrupos.setValue({
        id: curso.id,
        idCurso: curso.idCurso,
        nombre: curso.nombre,
        responsable: curso.responsable,
        actividades: curso.actividades,
        numParticipantes: curso.numParticipantes,
        lugar: curso.lugar,
        descripcion: curso.descripcion,
        materiales: curso.materiales,
        //observaciones: curso.observaciones,
        fechaInicio: addDaysToDate(curso.fechaInicio,1),
        fechaFin:  addDaysToDate(curso.fechaFin,1),
        fechaMaxInscripcion: addDaysToDate(curso.fechaMaxInscripcion,1),

      })
      this.loaderGuardar=false;
    })
  }


  vaciarFormulario() {
    this.formGrupos.setValue({
      id: null, idCurso: null,
      actividades: "",
      descripcion: "",
      fechaFin: null,
      fechaInicio: null,
      fechaMaxInscripcion: null,
      lugar: "",
      materiales: "",
      nombre: "",
      numParticipantes: 0,
      //observaciones: "",
      responsable: ""

    })
  }


}

function addDaysToDate(date, days): any {
  var res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
}
