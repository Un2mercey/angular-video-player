import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {

    private readonly _isLoading: BehaviorSubject<boolean>;
    get isLoading(): Observable<boolean> {
        return this._isLoading.asObservable();
    }

    constructor() {
        this._isLoading = new BehaviorSubject<boolean>(false);
    }

    public setIsLoading(value: boolean): void {
        this._isLoading.next(value);
    }
}
