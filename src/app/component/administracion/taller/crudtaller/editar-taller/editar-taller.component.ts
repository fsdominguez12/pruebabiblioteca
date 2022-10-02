import { Component, OnInit } from '@angular/core';
import {CursoService} from "../../../../../services/curso.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {TallerService} from "../../../../../services/taller.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Taller} from "../../../../../models/taller";

@Component({
  selector: 'app-editar-taller',
  templateUrl: './editar-taller.component.html',
  styleUrls: ['./editar-taller.component.css']
})
export class EditarTallerComponent implements OnInit {

  loaderCargar:boolean;
  loaderGuardar:boolean;

  constructor(
    private tallerService: TallerService,
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loaderCargar=true;
    this.activatedRoute.params.subscribe(params => {

      this.tallerService.getAllTaller().subscribe(value => {

        var taller: Taller=value.filter(value1 => value1.id==params['id'])[0];
        this.formGrupos.setValue({
          id:taller.id,
          idTaller:taller.idTaller,
          descripcion: taller.descripcion,
          fechaFin: addDaysToDate(taller.fechaFin,1),
          fechaInicio: addDaysToDate(taller.fechaInicio,1),
          fechaMaxInscripcion: addDaysToDate(taller.fechaMaxInscripcion,1),
          lugar: taller.lugar,
          nombre: taller.nombre,
          responsable: taller.responsable


        })
      })

    })
  }


  formGrupos = new FormGroup({
    id: new FormControl<Number>(0),
    idTaller: new FormControl<Number>(0),
    nombre: new FormControl<String>('', [Validators.required]),
    responsable: new FormControl<String>('', [Validators.required]),
    lugar: new FormControl<String>('', [Validators.required]),
    descripcion: new FormControl<String>('', [Validators.required]),
    fechaMaxInscripcion: new FormControl<Date | null>(null,[Validators.required]),
    fechaInicio: new FormControl<Date | null>(null,[Validators.required]),
    fechaFin: new FormControl<Date | null>(null,[Validators.required]),
  })


  guardarTaller() {
    console.log(this.formGrupos.getRawValue())
    this.tallerService.updateTaller(this.formGrupos.getRawValue()).subscribe(value => {
      this._snackBar.open('Taller actualizado', 'ACEPTAR');
      this.vaciarFormulario()
      this.loaderGuardar=false
    },error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
      this.loaderGuardar=false

    })
  }


  vaciarFormulario(){
    this.formGrupos.setValue({
      id: null,
      idTaller: null,
      nombre: "",
      responsable: "",
      lugar: "",
      descripcion: "",
      fechaMaxInscripcion: null,
      fechaInicio: null,
      fechaFin: null
    })
  }



}
function addDaysToDate(date, days): any {
  var res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
}
