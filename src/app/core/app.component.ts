import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    constructor(
        public readonly spinnerService: SpinnerService
    ) {
        // this.spinnerService.setIsLoading(true);
    }
}
