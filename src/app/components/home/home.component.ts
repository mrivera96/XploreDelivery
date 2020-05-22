/// <reference types="@types/googlemaps" />
import {Component, ElementRef, Input, OnInit, Output, ViewChild} from '@angular/core'
import {CategoriesService} from 'src/app/services/categories.service'
import {Category} from 'src/app/models/category'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {Order} from 'src/app/models/order'
import {formatDate} from '@angular/common'
import {DeliveriesService} from 'src/app/services/deliveries.service'
import {RatesService} from "../../services/rates.service";
import {Rate} from "../../models/rate";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";


declare var $: any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loaders = {
    'loadingAdd' : false,
    'loadingPay': false,
    'loadingSubmit': false,
    'loadingDistBef': false
  }
  befDistance = 0
  befTime = 0
  befCost = 0.00

  categories: Category[]
  deliveryForm: FormGroup
  orders: Order[] = []
  currOrder: Order
  agregado = false
  exitMsg = ''
  nDeliveryResponse
  rates: Rate[] = []
  @ViewChild('originCords') originCords: ElementRef
  @ViewChild('destinationCords') destinationCords: ElementRef

  expmonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  expYears = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
  @Input() cardType
  cardSrc = ''
  placesOrigin = []
  placesDestination = []
  pago = {
    'baseRate':  0.00,
    'recargos' : 0.00,
    'total' : 0.00,
  }

  pagos = []
  prohibitedDistance = false
  prohibitedDistanceMsg = ''
  payNow = false
  paymentMethod: number = 1
  billing: FormGroup
  gcordsOrigin = false
  gcordsDestination = false


  constructor(
    private categoriesSService: CategoriesService,
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    private ratesService: RatesService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.deliveryForm = this.formBuilder.group({
      deliveryHeader: this.formBuilder.group({
        nomCliente: ['', Validators.required],
        numIdentificacion: ['', [Validators.required, Validators.maxLength(14), Validators.minLength(13)]],
        numCelular: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
        hora: [formatDate(new Date(), 'HH:mm', 'en'), Validators.required],
        dirRecogida: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        idCategoria: [1, Validators.required],
      }),

      orders: this.formBuilder.group({
        nFactura: ['', Validators.required],
        nomDestinatario: ['', Validators.required],
        numCel: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        direccion: ['', Validators.required],
        distancia: ['']
      })
    });

    this.billing = this.formBuilder.group({
      nomTarjeta: ['', Validators.required],
      numTarjeta: ['', [Validators.required, Validators.maxLength(19), Validators.minLength(19)]],
      mesVencimiento: ['', Validators.required],
      anioVencimiento: ['', Validators.required],
      codSeg: ['', Validators.required]
    })

    this.paymentMethod = 1


    this.loadData()
  }

  loadData() {
    this.categoriesSService.getAllCategories().subscribe(response => {
        this.categories = response.data
      })

    this.ratesService.getRates().subscribe(response => {
      this.rates = response.data
    })
  }

  onOrderAdd() {

    if (this.deliveryForm.get('orders').valid) {
      this.loaders.loadingAdd = true
      this.currOrder = {
        nFactura: this.deliveryForm.get('orders').get('nFactura').value,
        nomDestinatario: this.deliveryForm.get('orders').get('nomDestinatario').value,
        numCel: this.deliveryForm.get('orders').get('numCel').value,
        direccion: this.deliveryForm.get('orders').get('direccion').value,
      }

      this.deliveryForm.get('deliveryHeader').get('idCategoria').disable({onlySelf: true})
      this.deliveryForm.get('deliveryHeader').get('dirRecogida').disable({onlySelf: true})
      let ordersCount = this.orders.length + 1
      //
      this.calculateRate(ordersCount)

      this.calculateDistance()

      this.befDistance = 0
      this.befTime = 0
      this.befCost = 0.00
    }
  }

  onFormSubmit() {
    if (this.deliveryForm.get('deliveryHeader').valid && this.orders.length > 0) {
      this.loaders.loadingSubmit = true;
      this.deliveriesService.newDelivery(this.deliveryForm.get('deliveryHeader').value, this.orders, this.pago).subscribe(response => {
          if (response.error == 0) {
            this.deliveryForm.reset()
            this.billing.reset()
            this.orders = []
            this.pagos = []

            this.loaders = {
              'loadingAdd' : false,
              'loadingPay': false,
              'loadingSubmit': false,
              'loadingDistBef': false
            }

            this.categories = []

            this.agregado = false
            this.exitMsg = ''
            this.nDeliveryResponse =
            this.rates = []

            this.cardSrc = ''
            this.placesOrigin = []
            this.placesDestination = []
            this.pago = {
              'baseRate':  0.00,
              'recargos' : 0.00,
              'total' : 0.00,
            }

            this.prohibitedDistance = false
            this.prohibitedDistanceMsg = ''
            this.payNow = false

            this.loaders.loadingSubmit = false

            this.exitMsg = response.message
            this.nDeliveryResponse = response.nDelivery
            const showModal: HTMLElement = document.getElementById('showSuccsModal') as HTMLElement
            showModal.click()
          } else if(response.error == 1){
            this.loaders.loadingSubmit = false
            //this.deliveryForm.reset();
            //this.orders=[];
            const showModal: HTMLElement = document.getElementById('showErrModal') as HTMLElement
            showModal.click()
          }

        });
    }

  }

  calculatedistanceBefore(){
    this.loaders.loadingDistBef = true
    let ordersCount = this.orders.length + 1
    //
    this.calculateRate(ordersCount)

    this.http.post<any>(`${environment.apiEndPoint}`, {
      function: 'calculateDistance',
      salida: this.deliveryForm.get('deliveryHeader').get('dirRecogida').value,
      entrega: this.deliveryForm.get('orders').get('direccion').value,
      tarifa: this.pago.baseRate
    }).subscribe((response) => {

      if (response.codError == '0') {
        this.loaders.loadingDistBef = false
        this.befDistance = response.distancia
        this.befTime = response.tiempo
        this.befCost = response.total
      }else{
        this.loaders.loadingDistBef = false
      }
    })
  }

  searchOrigin(event) {
    let lugar = event.target.value
    this.http.post<any>(`${environment.apiEndPoint}`, {lugar: lugar, function: 'searchPlace'}).subscribe(response => {
      this.placesOrigin = response
    })
  }

  searchDestination(event) {
    let lugar = event.target.value
    this.http.post<any>(`${environment.apiEndPoint}`, {lugar: lugar, function: 'searchPlace'}).subscribe(response => {
      this.placesDestination = response

    })
  }

  calculateRate(ordersCount) {
    this.rates.forEach(value => {
      if (ordersCount >= value.entregasMinimas
        && ordersCount <= value.entregasMaximas
        && this.deliveryForm.get('deliveryHeader').get('idCategoria').value == value.idCategoria) {
        this.pago.baseRate = value.precio

      } else if (ordersCount == 0) {
        this.pago.baseRate = 0.00
      }
    })
  }

  calculateDistance() {
    const salida = this.deliveryForm.get('deliveryHeader').get('dirRecogida').value
    const entrega = this.deliveryForm.get('orders').get('direccion').value
    const tarifa = this.pago.baseRate


    this.http.post<any>(`${environment.apiEndPoint}`, {
      function: 'calculateDistance',
      salida: salida,
      entrega: entrega,
      tarifa: tarifa
    }).subscribe((response) => {

      if (response.codError == '0') {
        this.currOrder.distancia = response.distancia
        let pago = {
          'tarifaBase': +response.tarifa,
          'recargos': +response.recargo,
          'total': +response.total
        }

        this.deliveryForm.get('orders').reset()
        this.orders.push(this.currOrder)
        this.pagos.push(pago)
        this.loaders.loadingAdd = false


        this.agregado = true
        setTimeout(() => {
          this.agregado = false;
        }, 2000)
      } else if (response.codError == '1') {
        this.prohibitedDistanceMsg = response.msgError
        this.prohibitedDistance = true
        this.loaders.loadingAdd = false
        setTimeout(() => {
          this.prohibitedDistance = false;
        }, 2000)
      }
      this.calculatePayment()
    })

  }

  validateCard(event) {
    if (event == 'Visa') {
      this.cardSrc = 'Visa'
    } else if (event == 'Master Card') {
      this.cardSrc = 'MC'
    } else if (event == null) {
      this.cardSrc = ''
    }
  }

  setOrigin(origin) {
    this.deliveryForm.get('deliveryHeader').get('dirRecogida').setValue(origin)
    this.placesOrigin = []
  }

  calculatePayment() {
    this.pago.recargos = this.pagos.reduce(function (a, b) {
      return +a + +b['recargos'];
    }, 0)

    this.pago.total = Number(this.pago.baseRate) + Number(this.pago.recargos)
  }

  setDestination(destination) {
    this.deliveryForm.get('orders').get('direccion').setValue(destination)
    this.placesDestination = []
    this.calculatedistanceBefore()
  }

  removeFromArray(item) {
    let i = this.orders.indexOf(item)
    this.orders.splice(i, 1)
    this.pagos.splice(i,1)
    this.calculateRate(this.orders.length)
    this.calculatePayment()
  }

  doPayment(){

  }

  reloadData(){
    this.ngOnInit()
  }

  setCurrentLocationOrg(event){
    if(event.target.checked == true){
      if(navigator){
        navigator.geolocation.getCurrentPosition( pos => {
          this.deliveryForm.get('deliveryHeader').get('dirRecogida').setValue(Number(pos.coords.latitude) + ','+ Number(pos.coords.longitude))
          if(this.deliveryForm.get('orders').get('direccion').value != ''){
            this.calculatedistanceBefore()
          }
        });
      }else{
        alert('Por favor activa la ubicación para esta función')
      }
    }else{
      this.deliveryForm.get('deliveryHeader').get('dirRecogida').setValue('')
    }

  }

  setCurrentLocationDest(event){
    if(event.target.checked == true){
      if(navigator){
        navigator.geolocation.getCurrentPosition( pos => {
          this.deliveryForm.get('orders').get('direccion').setValue(Number(pos.coords.latitude) + ','+ Number(pos.coords.longitude))
          this.calculatedistanceBefore()
        });
      }else{
        alert('Por favor activa la ubicación para esta función')
      }
    }else{
      this.deliveryForm.get('orders').get('direccion').setValue('')
    }

  }

  setCordsOrigin(){
    this.deliveryForm.get('deliveryHeader').get('dirRecogida').setValue(this.originCords.nativeElement.value)
    this.gcordsOrigin = false

    if(this.deliveryForm.get('orders').get('direccion').value != ''){
      this.calculatedistanceBefore()
    }

  }

  setCordsDestination(){
    this.deliveryForm.get('orders').get('direccion').setValue(this.destinationCords.nativeElement.value)
    this.gcordsDestination = false
    this.calculatedistanceBefore()
  }

}
