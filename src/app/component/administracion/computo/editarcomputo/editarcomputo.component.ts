import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ComputoService} from "../../../../services/computo.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {Computo} from "../../../../models/computo";

@Component({
  selector: 'app-editarcomputo',
  templateUrl: './editarcomputo.component.html',
  styleUrls: ['./editarcomputo.component.css']
})
export class EditarcomputoComponent implements OnInit {

  loaderGuardar: boolean;
  loaderActualizar: boolean;
  loaderCargar:boolean;
  selected = new FormControl(0);

  constructor(private computoService:ComputoService,
              private _snackBar:MatSnackBar,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loaderCargar=true;
    this.activatedRoute.params.subscribe(params =>{

      this.computoService.getAllComputoInventario().subscribe(value => {
        console.log(value)
        var computo:Computo=value.filter(value1 => value1.id==params['id'])[0];
        this.formGrupos.setValue({
          id: computo.id,
          numero: computo.numero,
          estado: computo.estado,
          procesador: computo.procesador,
          ram: computo.ram,
          discoDuro: computo.discoDuro,
          estadoPrestamo: computo.estadoPrestamo
        })

      })

    })
  }

  formGrupos = new FormGroup({
    id: new FormControl<Number>(0),
    numero: new FormControl<String>('', [Validators.required]),
    estado: new FormControl<boolean>(null, [Validators.required]),
    procesador: new FormControl<String>('', [Validators.required]),
    ram: new FormControl<String>('', [Validators.required]),
    discoDuro: new FormControl<String>('', [Validators.required]),
    estadoPrestamo:new FormControl<boolean>(false)
  })


  guardarCliente() {
    console.log(this.formGrupos.getRawValue())
    this.computoService.updateComputo(this.formGrupos.getRawValue()).subscribe(value => {
      this._snackBar.open('Computo Editado', 'ACEPTAR');
      this.selected.setValue(2)
      this.vaciarFormulario()

      this.loaderGuardar = false
    }, error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
      this.loaderGuardar = false
    })
  }

  vaciarFormulario() {
    this.formGrupos.setValue({
      id: null,
      numero: null,
      estado: null,
      procesador: null,
      ram: null,
      discoDuro: null,
      estadoPrestamo: null
    })
  }


}
