import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SintelComponent } from './sintel.component';

describe('VideoPlayerComponent', () => {
    let component: SintelComponent;
    let fixture: ComponentFixture<SintelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ SintelComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SintelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
