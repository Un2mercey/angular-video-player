import { Router } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    constructor(
        public readonly spinnerService: SpinnerService,
        private readonly router: Router
    ) {
    }

    public changeState(state: string): void {
        this.spinnerService.setIsLoading(true);
        setTimeout(() => {
            void this.router.navigate([state]);
            this.spinnerService.setIsLoading(false);
        }, 2000);
    }
}
