import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PlacesComponent } from './places/places.component';
import { MapComponent } from './map/map.component';
import { PlacesService } from './services/places.service';
import { LocationComponent } from './location/location.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PlacesComponent,
    MapComponent,
    LocationComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [PlacesService],
  bootstrap: [AppComponent],
})
export class AppModule {}
