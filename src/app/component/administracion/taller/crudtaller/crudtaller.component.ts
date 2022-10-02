import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CursoService} from "../../../../services/curso.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {TallerService} from "../../../../services/taller.service";
import {Taller} from "../../../../models/taller";


@Component({
  selector: 'app-crudtaller',
  templateUrl: './crudtaller.component.html',
  styleUrls: ['./crudtaller.component.css']
})
export class CrudtallerComponent implements OnInit {

  loaderGuardar: boolean;
  loaderActualizar: boolean;
  selected = new FormControl(0);

  displayedColumns: string[] = ['id', 'nombre', 'fechaInicio', 'fechaFin', 'responsable', 'acciones'];
  dataSource: MatTableDataSource<Taller>;

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tallerService: TallerService,
              private _snackBar: MatSnackBar,
              private router: Router,) {

  }

  ngOnInit(): void {
    this.listarTalleres();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  listarTalleres() {
    this.loaderActualizar = true
    this.tallerService.getAllTaller().subscribe(value => {
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loaderActualizar = false

    })
  }


  formGrupos = new FormGroup({
    id: new FormControl<Number>(0),
    idTaller: new FormControl<Number>(0),
    nombre: new FormControl<String>('', [Validators.required]),
    responsable: new FormControl<String>('', [Validators.required]),
    lugar: new FormControl<String>('', [Validators.required]),
    descripcion: new FormControl<String>('', [Validators.required]),
    fechaMaxInscripcion: new FormControl<Date | null>(null, [Validators.required]),
    fechaInicio: new FormControl<Date | null>(null, [Validators.required]),
    fechaFin: new FormControl<Date | null>(null, [Validators.required]),
  })

  guardarTaller() {
    this.loaderGuardar=true;
    if (this.formGrupos.getRawValue().id==null){
      this.tallerService.saveTaller(this.formGrupos.getRawValue()).subscribe(value => {
        this._snackBar.open('Taller registrado', 'ACEPTAR');
        this.selected.setValue(2)
        this.listarTalleres()
        this.vaciarFormulario()
        this.loaderGuardar = false
      }, error => {
        this._snackBar.open(error.error.message, 'ACEPTAR');
        this.loaderGuardar = false
      })
    }else {
      this.tallerService.updateTaller(this.formGrupos.getRawValue()).subscribe(value => {
        this._snackBar.open('Taller actualizado', 'ACEPTAR');
        this.selected.setValue(2)
        this.listarTalleres()
        this.vaciarFormulario()
        this.loaderGuardar = false
      },error => {
        this._snackBar.open(error.error.message, 'ACEPTAR');
        this.loaderGuardar=false

      })
    }

  }


  actualizarTaller(id: Number) {
    this.vaciarFormulario()
    this.selected.setValue(0)
    this.loaderGuardar=true;

    this.tallerService.getAllTaller().subscribe(value => {
      var taller: Taller = value.filter(value1 => value1.id == id)[0];
      this.formGrupos.setValue({
        id: taller.id,
        idTaller: taller.idTaller,
        descripcion: taller.descripcion,
        fechaFin: addDaysToDate(taller.fechaFin, 1),
        fechaInicio: addDaysToDate(taller.fechaInicio, 1),
        fechaMaxInscripcion: addDaysToDate(taller.fechaMaxInscripcion, 1),
        lugar: taller.lugar,
        nombre: taller.nombre,
        responsable: taller.responsable
      })
      this.loaderGuardar=false;
    })
  }


  vaciarFormulario() {
    this.formGrupos.setValue({
      id: null, idTaller: null,
      descripcion: "",
      fechaFin: null,
      fechaInicio: null,
      fechaMaxInscripcion: null,
      lugar: "",
      nombre: "",
      responsable: ""

    })
  }


}

function addDaysToDate(date, days): any {
  var res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
}
