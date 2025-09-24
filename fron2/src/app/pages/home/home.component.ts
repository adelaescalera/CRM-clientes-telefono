import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../service/client.service';
import { ClientsTableComponent } from './clients-table/clients-table.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ClientsTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  tablas:any[] = [];

  constructor( private clientService : ClientService ) { }

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
   this.clientService.getData().subscribe( res => {  
      this.tablas=res.data;
       console.log(this.tablas);
   });
  }
  
}
