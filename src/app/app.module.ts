import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomeComponent } from './components/home/home.component'
import { HttpClientModule } from '@angular/common/http'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import { PhoneMaskDirective } from './phone-mask.directive';
import { CardMaskDirective } from './card-mask.directive'
import {AgmCoreModule} from "@agm/core";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PhoneMaskDirective,
    CardMaskDirective
  ],
  exports: [
    PhoneMaskDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD0QIqVa1DFFvD8dcYyvHmHRx71bBc09U0',
      libraries: ['geometry']
    })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
