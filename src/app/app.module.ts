import { NgModule } from '@angular/core';
import { AppUiModule } from './app-ui.module';
import { AppComponent } from './core/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './pages/home/home.component';
import { SintelComponent } from './pages/sintel/sintel.component';
import { AppRoutingModule } from './app-routing.module';
import { TearsOfStealComponent } from './pages/tears-of-steal/tears-of-steal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SintelComponent,
        TearsOfStealComponent,
    ],
    imports: [
        AppUiModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
