import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/models/category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/models/order';
import { formatDate } from '@angular/common';
import { DeliveriesService } from 'src/app/services/deliveries.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories: Category[];
  deliveryForm: FormGroup;
  loading = false;
  orders: Order[] = [];
  currOrder: Order;
  agregado = false;
  exitMsg = '';
  nDeliveryResponse;
  errMsg='';


  constructor(
    private categoriesSService: CategoriesService,
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService
  ) { }

  ngOnInit(): void {
    this.deliveryForm = this.formBuilder.group({
      deliveryHeader:  this.formBuilder.group({
        nomCliente: ['', Validators.required],
        numIdentificacion: ['', Validators.required],
        numCelular: ['', Validators.required],
        fecha: [formatDate(new Date, 'yyyy-MM-dd', 'en'), Validators.required],
        dirRecogida: ['', Validators.required],
        email: ['', Validators.required],
        idCategoria: [null, Validators.required],
      }),
     
      orders: this.formBuilder.group({
        nFactura: ['', Validators.required],
        nomDestinatario: ['', Validators.required],
        numCel: ['', Validators.required],
        direccion: ['', Validators.required]
      })
    });

    this.loadData();
  }

  loadData() {
    this.categoriesSService.getAllCategories().subscribe(response => {
      this.categories = response.data;
    });
  }

  onOrderAdd(){
    if(this.deliveryForm.get('orders').valid){
      this.agregado = true;
      this.currOrder = {
        nFactura: this.deliveryForm.get('orders').get('nFactura').value,
        nomDestinatario: this.deliveryForm.get('orders').get('nomDestinatario').value,
        numCel: this.deliveryForm.get('orders').get('numCel').value,
        direccion: this.deliveryForm.get('orders').get('direccion').value
      };

      this.orders.push(this.currOrder);
      this.deliveryForm.get('orders').reset();

      setTimeout( () => {  this.agregado = false; }, 2000 );
      
    
    }
  }

  onFormSubmit(){
    if(this.deliveryForm.get('deliveryHeader').valid && this.orders.length > 0){
      this.loading = true;
      this.deliveriesService.newDelivery(this.deliveryForm.get('deliveryHeader').value, this.orders).subscribe(response => {
        this.deliveryForm.reset();
        this.orders=[];
        this.loading = false;
        if(response.error == 0){
          this.exitMsg = response.message;
          this.nDeliveryResponse = response.nDelivery;
          const showModal: HTMLElement = document.getElementById('showSuccsModal') as HTMLElement;
          showModal.click();
        }
      },
      error => {
        this.loading =false;
        //this.deliveryForm.reset();
        //this.orders=[];
        const showModal: HTMLElement = document.getElementById('showErrModal') as HTMLElement;
          showModal.click();
      });
    }

  }

}
