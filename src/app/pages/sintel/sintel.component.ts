import { PlayPause } from '../../model/play-pause.enum';
import {
    Component,
    ChangeDetectionStrategy,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import { BehaviorSubject, defer, fromEvent, interval, map, Observable, Subject, Subscription, takeUntil } from 'rxjs';


@Component({
    selector: 'app-sintel',
    templateUrl: './sintel.component.html',
    styleUrls: ['./sintel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SintelComponent implements AfterViewInit, OnDestroy {

    public playPauseBtn: PlayPause;

    @ViewChild('videoElement')
    private readonly _videoElement!: ElementRef<HTMLVideoElement>;

    private get media(): HTMLVideoElement {
        return this._videoElement.nativeElement;
    }

    @ViewChild('progressElement')
    private readonly _progressElement!: ElementRef<HTMLDivElement>;

    private get progressDiv(): HTMLDivElement {
        return this._progressElement.nativeElement;
    }

    private readonly _timer$: BehaviorSubject<string>;

    get timer$(): Observable<string> {
        return this._timer$.asObservable();
    }

    private readonly _progress$: BehaviorSubject<number>;

    get progress$(): Observable<number> {
        return this._progress$.asObservable();
    }

    private readonly _destroy$: Subject<boolean>;
    private readonly _timeUpdate$: Observable<number>;
    private timeUpdateSub$: Subscription | undefined;
    private interval$: Subscription | undefined;

    constructor() {
        this.playPauseBtn = PlayPause.Play;
        this._timer$ = new BehaviorSubject<string>('00:00');
        this._progress$ = new BehaviorSubject(0);
        this._destroy$ = new Subject<boolean>();
        this._timeUpdate$ = defer(() => fromEvent(this.media, 'timeupdate').pipe(
            map(() => this.media.currentTime / this.media.duration)
        ));
    }

    public ngAfterViewInit(): void {
        this.removeControls();
        this.timeUpdateSub$ = this._timeUpdate$.subscribe(this.timeUpdateHandler);
    }

    public ngOnDestroy(): void {
        this._destroy$.next(true);
        (this.timeUpdateSub$ as Subscription).unsubscribe();
    }

    public playPauseMedia(play?: boolean): void {
        this._destroy$.next(true);
        if (play || this.media.paused) {
            this.playPauseBtn = PlayPause.Pause;
            void this.media.play();
        } else {
            this.playPauseBtn = PlayPause.Play;
            void this.media.pause();
        }
    }

    public stop(): void {
        this._destroy$.next(true);
        this.media.pause();
        this.media.currentTime = 0;
        this.playPauseBtn = PlayPause.Play;
    }

    public rwd(): void {
        this.forwardWrapper(this.windBackward);
    }

    public fwd(): void {
        this.forwardWrapper(this.windForward);
    }

    private readonly forwardWrapper = (func: () => void): void => {
        this.playPauseBtn = PlayPause.Play;
        if (!!this.interval$ && !this.interval$.closed) {
            this.playPauseMedia(true);
        } else {
            this.setInterval(func);
        }
    };

    private readonly timeUpdateHandler = (time: number): void => {
        this._progress$.next(this.progressDiv.clientWidth * time);
        this._timer$.next(this.getTime());
    };

    private readonly getTime = (): string => {
        const minutes = Math.floor(this.media.currentTime / 60);
        const seconds = Math.floor(this.media.currentTime - minutes * 60);
        return `${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
    };

    private readonly formatTime = (time: number): string | number => {
        return time > 9 ? time : `0${time}`;
    };

    private readonly windBackward = (): void => {
        if (this.media.currentTime <= 3) {
            this.stop();
        } else {
            this.media.currentTime -= 3;
        }
    };

    private readonly windForward = (): void => {
        if (this.media.currentTime >= this.media.duration - 3) {
            this.stop();
        } else {
            this.media.currentTime += 3;
        }
    };

    private setInterval(func: () => void): void {
        this.interval$ = interval(200)
            .pipe(takeUntil(this._destroy$))
            .subscribe(func);
    }

    private removeControls(): void {
        this.media.removeAttribute('controls');
        (this.media.nextElementSibling as HTMLDivElement).style.visibility = 'visible';
    }
}
