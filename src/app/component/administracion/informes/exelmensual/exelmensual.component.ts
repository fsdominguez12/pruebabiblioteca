import {Component, OnInit, ViewChild} from '@angular/core';
import {ClienteService} from "../../../../services/cliente.service";
import {MatTableDataSource} from "@angular/material/table";
import {PersonaCliente} from "../../../../models/personaCliente";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Reporte} from "../../../../models/reporte";
import * as XLSX from "xlsx";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-exelmensual',
  templateUrl: './exelmensual.component.html',
  styleUrls: ['./exelmensual.component.css']
})
export class ExelmensualComponent implements OnInit {


  ver:Boolean;
  carga:Boolean;

  displayedColumns: string[] = ['codigo', 'no', 'fecha', 'apellidos', 'nombres', 'cedula',
    'fecha_nacimiento', 'edad', 'genero', 'estado_civil', 'provincia', 'canton', 'parroquia',
    'barrio', 'discapacidad', 'email', 'telefono', 'repositorio', 'biblioteca',
    'computo', 'copias', 'talleres', 'nombretaller', 'verificables'];
  dataSource: MatTableDataSource<Reporte>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private clienteService: ClienteService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {

  }


  consultarDatos(mes: HTMLInputElement) {
    this.carga=true;
    var n: String[] = []
    n = mes.value.split('-');
    this.clienteService.getReporteMensual(n[1], n[0]).subscribe(value => {
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.ver=true;
      this.carga=false;
    }, error => {
      this.carga=false;
      this._snackBar.open(error.error.message, 'ACEPTAR');
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  exportToExcel(mes: HTMLInputElement): void {
    let element = document.getElementById('table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, 'Lista de Clientes '+mes.value+'.xlsx');
  }

}
