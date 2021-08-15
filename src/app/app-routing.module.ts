import { filter } from 'rxjs';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { SintelComponent } from './pages/sintel/sintel.component';
import { TearsOfStealComponent } from './pages/tears-of-steal/tears-of-steal.component';
import { NavigationEnd, Router, RouterEvent, RouterModule, Routes } from '@angular/router';

const PREV_URL_KEY = 'previous_state';
const setState = (ev: RouterEvent): void => localStorage.setItem(PREV_URL_KEY, ev.url);
const getState = (): string => localStorage.getItem(PREV_URL_KEY) || 'home';
const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomeComponent },
    { path: 'sintel', component: SintelComponent },
    { path: 'tears-of-steal', component: TearsOfStealComponent },
    { path: '**', redirectTo: getState() }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
    constructor(
        private router: Router
    ) {
        this.router.events.pipe(
            filter(ev => ev instanceof RouterEvent && ev instanceof NavigationEnd)
        ).subscribe(ev => setState(ev as RouterEvent));
    }
}
