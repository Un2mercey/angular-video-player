import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TearsOfStealComponent } from './tears-of-steal.component';

describe('TearsOfStealComponent', () => {
    let component: TearsOfStealComponent;
    let fixture: ComponentFixture<TearsOfStealComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ TearsOfStealComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TearsOfStealComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
