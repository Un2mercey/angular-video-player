import {
    AfterViewInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { PlayPause } from '../../model/play-pause.enum';
import { MuteUnmute } from '../../model/mute-unmute.enum';
import { BehaviorSubject, defer, fromEvent, map, Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-tears-of-steal',
    templateUrl: './tears-of-steal.component.html',
    styleUrls: ['./tears-of-steal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TearsOfStealComponent implements OnInit, AfterViewInit, OnDestroy {

    public playPauseBtn: PlayPause;
    public muteUnmuteBtn: MuteUnmute;
    public fullScreenEnabled: boolean;

    @ViewChild('video')
    private readonly _video!: ElementRef<HTMLVideoElement>;

    get video(): HTMLVideoElement {
        return this._video.nativeElement;
    }

    @ViewChild('videoContainer')
    private readonly _videoContainer!: ElementRef<HTMLElement>;

    private _isVideoSupported: boolean;

    get isVideoSupported(): boolean {
        return this._isVideoSupported;
    }

    set isVideoSupported(value: boolean) {
        this._isVideoSupported = value;
    }

    private readonly _loadedMetadata$: Observable<Event>;
    private readonly _timeUpdate$: Observable<number>;
    private readonly _videoEnded$: Observable<Event>;
    private readonly subscriptions: Array<Subscription>;
    private readonly _progress$: BehaviorSubject<number>;

    get progress$(): Observable<number> {
        return this._progress$.asObservable();
    }

    constructor(
        private readonly _cdr: ChangeDetectorRef
    ) {
        this.playPauseBtn = PlayPause.Play;
        this.muteUnmuteBtn = MuteUnmute.Unmute;
        this.fullScreenEnabled = document.fullscreenEnabled;
        this._progress$ = new BehaviorSubject<number>(0);
        this._isVideoSupported = false;
        this._loadedMetadata$ = defer(() => fromEvent(this.video, 'loadedmetadata'));
        this._videoEnded$ = defer(() => fromEvent(this.video, 'ended'));
        this._timeUpdate$ = defer(() => fromEvent(this.video, 'timeupdate').pipe(
            map(() => this.video.currentTime / this.video.duration)
        ));
        this.subscriptions = [];
    }

    public ngOnInit(): void {
        this.isVideoSupported = !!document.createElement('video').canPlayType;
    }

    public ngAfterViewInit(): void {
        if (this.isVideoSupported) {
            this.video.removeAttribute('controls');
            const loadedMetaDataSub$ = this._loadedMetadata$.subscribe(this.loadedMetaDataHandler);
            const timeUpdateSub$ = this._timeUpdate$.subscribe(this.timeUpdateHandler);
            const videoEndedSub$ = this._videoEnded$.subscribe(this.videoEndedHandler);
            this.subscriptions.push(loadedMetaDataSub$, timeUpdateSub$, videoEndedSub$);
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions
            .filter(s => !!s && !s.closed)
            .forEach(s => s.unsubscribe());
    }

    public playPauseHandler(): void {
        if (this.video.paused) {
            void this.video.play();
            this.playPauseBtn = PlayPause.Pause;
        } else {
            void this.video.pause();
            this.playPauseBtn = PlayPause.Play;
        }
    }

    public stopHandler(): void {
        void this.video.pause();
        this.video.currentTime = 0;
        this.playPauseBtn = PlayPause.Play;
        this._progress$.next(0);
    }

    public muteUnmuteHandler(): void {
        this.video.muted = !this.video.muted;
        this.muteUnmuteBtn = this.video.muted ? MuteUnmute.Mute : MuteUnmute.Unmute;
    }

    public volumeControlHandler(direction: 0 | 1): void {
        const currentVolume = Math.floor(this.video.volume * 10) / 10;
        switch (direction) {
            case 0:
                if (currentVolume > 0) {
                    this.video.volume -= 0.1;
                }
                break;
            case 1:
                if (currentVolume < 1) {
                    this.video.volume += 0.1;
                }
                break;
        }
    }

    public skipAheadHandler(e: MouseEvent): void {
        const div: HTMLDivElement = e.target as HTMLDivElement;
        const rect = div.getBoundingClientRect();
        const pos = (e.pageX - rect.left) / div.offsetWidth;
        this.video.currentTime = pos * this.video.duration;
    }

    public fullScreenHandler(): void {
        if (this.isFullScreen()) {
            void document.exitFullscreen();
            this.setFullscreenData('false');
        } else {
            void this._videoContainer.nativeElement.requestFullscreen();
            this.setFullscreenData('true');
        }
    }

    private setFullscreenData(state: string): void {
        this._videoContainer.nativeElement.setAttribute('data-fullscreen', state);
    }

    private readonly loadedMetaDataHandler = (): void => {
        console.log(`[Metadata loaded] Video width is: ${this.video.duration} sec`);
    };

    private readonly timeUpdateHandler = (e: number): void => {
        this._progress$.next(Math.floor(e * 100));
    };

    private readonly videoEndedHandler = (): void => {
        void this.video.pause();
        this.playPauseBtn = PlayPause.Play;
        this._cdr.detectChanges();
    };

    private readonly isFullScreen = (): boolean => {
        return !!(document.fullscreenElement && document.fullscreenElement.nodeName == 'FIGURE');
    };
}
