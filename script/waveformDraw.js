/* ================================
    WAVEFORM 을 그리는 함수 분리함.
================================ */

var waveformDraw = {
    // audio 속성들..
    waveBuffer: [],     // FloatArray
    samplerate: 44100,  // Audio SampleRate
    currPos: 0,         // 현재 play 중인 위치.
    scrollOffset: 0,     // Scroll 되어 drawing을 시작할 msec
    startOffset: 0,     // waveform 과 박자 grid 의 시간 차이 보정.
    numSmp4Px: 256,     // 1 pixel 당 smaple 수. = drawing 의 기준. 
    msec4Quaver: 500,   // 8분음표에 해당하는 시간(msec)   - default: 60 bpm 일 때, 4분음표는 1초, 즉, 8분음표는 0.5초
    semiQuaverMode: false,  // 16분음표 편집 모드(=true) 또는 8분음표 편집 모드(=false)
    numQuaver4Word: 8,  // 1마디에 해당하는 음표 갯수      - default: 8분음표 단위 편집, / or 16=16분음표 단위 편집.
                                                                    // 8분음표 3/4박자일 땐, 6이 될 것. 16분음표는 12..
    // drawing 을 위한 parameter들
    x: 0, 
    y: 0,
    w: 800,
    h: 200,
    // 아래는 local 변수들 ?

    /////////////////
    // 기본 함수들.
    init: () => {
        console.log("[][][][][][][][][][]\n  initialize wavefrawDraw... []\n[][][][][][][][][][]");
        this.waveBuffer = [];
        this.samplerate = 48000;
        this.currPos = 0;
        this.scrollOffset = 0;
        this.startOffset = 0;
        this.numSmp4Px = 256;
        this.msec4Quaver = 500;
        this.semiQuaverMode = false,
        this.numQuaver4Word = 8;
        this.x = 0; 
        this.y = 0;
        this.w = 800;
        this.h = 200;
    }, 
    draw: (ctx) => {
        // console.log("start to draw.... curr:", this.currPos*1000);      // currPos = msec단위
        let xpos = this.x-0.5;     // 단지 draw를 하기 위해 위치 보정
        let center_y = (this.y+this.h)/2;  // canvas center 에 그리기 위해서 
        let i, j, min, max, value;
        let offset = (( (this.scrollOffset-this.startOffset) * this.samplerate) / 1000);        // let numSmp4msec = this.samplerate / 1000;
        // console.log("scrollOffset=",this.scrollOffset,", samplerate=", this.samplerate, ", offset=",offset, ", w=",this.w, ", x=", this.x);

        for (i=1; i<(this.w-this.x); i++ ) {
            let start_idx = parseInt( this.numSmp4Px*(i-1) +offset );       // offset 은 waveBuffer의 index (sample단위)
            let end_idx =  parseInt( this.numSmp4Px*i +offset );

            if ( (start_idx < 0) ) { //|| (end_idx >= this.waveBuffer.length) ) {   // 범위를 벗어나면.. 0 값으로.
                min = max = 0.0;
            } else {
                min=9999.0;
                max=-9999.0;
                for (j = start_idx; j<end_idx; j++) {
                    value = this.waveBuffer[j];
                    if ( value >= max)
                      max = value;      //parseInt(value);
                    if ( value <= min)
                      min = value;      //parseInt(value);
                }
            }
            ctx.beginPath();
            if ( (start_idx/this.samplerate) < this.currPos ) {      // play 지나간
                ctx.strokeStyle = "darkgray";
            } else if ( (parseInt(start_idx/this.samplerate) % 2) == 0 ) {    // 짝수 초(sec)라면 파랑. 아니면 녹색으로 표시 
                ctx.strokeStyle = "darkblue";       
            } else {
                ctx.strokeStyle = "darkgreen";
            }
            ctx.moveTo( xpos+i, center_y + min*this.h );
            ctx.lineTo( xpos+i, center_y + max*this.h );
            ctx.stroke();
        }
    },

    drawBg: (ctx) => {
        // 배경에 박자에 따라 마디 배경 그려줄 함수.
        let xpos = this.x-0.5;     // 단지 draw를 하기 위해 위치 보정
        let center_y = (this.y+this.h)/2;  // canvas center 에 그리기 위해서 
        let msec_per_pixel = this.numSmp4Px * 1000 / this.samplerate ;        // 1pixel 에 해당하는 msec 시간

        // console.log("[][]drawing Background.. W:", (this.w-this.x), ", msecPerPx=", msec_per_pixel, ", msec4Quaver=", this.msec4Quaver, ", quaver4Word=", this.numQuaver4Word );
        let edit_unit;
        switch(this.numQuaver4Word) {
            case 8:         // 1 마디 당 8분음표 8개 = 8분음표 기준 편집.
                edit_unit = 8; break;
            case 16:        // 1 마디 당 8분음표 16개 = 16분음표 기준 편집.
            case 6:         // 1 마디 당 8분음표 6개 = 8분음표 기준 편집, 3/4 박자.
            case 12:        // 1 마디 당 8분음표 12개 = 16분음표 기준 편집, 3/4 박자. ?
        }
        let msec_perGrid = (semiQuaverMode)?this.msec4Quaver*2 : this.msec4Quaver;
        // console.log(" EDIT UNIT=", msec_perGrid);

        let prev_beat = 15;
        for (i=1; i<(this.w-this.x); i++ ) {
            let beat = parseInt( (i*msec_per_pixel+this.scrollOffset) / (msec_perGrid/2) ) % this.numQuaver4Word;      // 1 마디를 8분음표로 나눈 갯수...
            if (beat == 0) {        // 마디 의 첫 비트
                ctx.fillStyle = "lightgreen";
            } else {
                ctx.fillStyle = "lightblue";
            }
            if (prev_beat != beat) {
                ctx.fillStyle = "grey";
                prev_beat = beat;
            }
            ctx.fillRect( xpos+i, this.y, 2, this.h );

            let msec = parseInt( (i*this.numSmp4Px) * 1000 / this.samplerate );         // i 번째 픽셀의 msec 값
            // console.log("msec=", msec);
        }
    },

    drawRuler: (ctx) => {
        // 눈금자 msec 단위로 그려주는 함수.
        let rulerGridSize;
        if (this.numSmp4Px > 2048) {
            rulerGridSize = 4000;
        } else if (this.numSmp4Px > 1024) {
            rulerGridSize = 2000;
        } else if (this.numSmp4Px > 512) {
            rulerGridSize = 1000;
        } else if (this.numSmp4Px > 256 ) {
            rulerGridSize = 500;
        } else if (this.numSmp4Px > 128) {
            rulerGridSize = 250;
        } else {   // if (this.numSmp4Px == 64) {
            rulerGridSize = 125;
        }

        let xpos = this.x-0.5;     // 단지 draw를 하기 위해 위치 보정
        // let msec_perPixel = (this.numSmp4Px * 1000) / this.samplerate;        // 1 pixel 당 msec
        ctx.fillStyle = "black";
        let prev_time = 0;
        for (i=0; i<(this.w-this.x); i++ ) {         // 50픽셀마다 그림
            let msec = parseInt( (i*this.numSmp4Px) * 1000 / this.samplerate )+this.scrollOffset;         // i 번째 픽셀의 msec 값
            if ( parseInt(msec/rulerGridSize) != parseInt(prev_time/rulerGridSize) ) {          //     rulerGridSize: 500,
                ctx.fillText( makeTimeString(msec), xpos+i, 10);
                prev_time = msec;
            }
        }
    },

    set_audioBuffer: (buf, samplerate) => {
        this.waveBuffer = buf;
        this.samplerate = samplerate;
        this.numSmp4Px = 256;
    },
    set_windowSize: (x, y, w, h) => {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    },
    set_scrollPos: (offset) => {
        this.scrollOffset = offset;
        console.log("offset=", this.scrollOffset);
    },
    get_scrollPos: () => {
        return parseInt(this.scrollOffset);
        console.log("offset=", this.scrollOffset);
    },
    set_startOffset: (offset) => {
        this.startOffset = offset;
    },
    get_startOffset: () => {
        return this.startOffset;
    },
    set_playingPosition: (pos) => {
        this.currPos = pos;
    },
    set_quaverSize: (note_size) => {        // 편집단위 조정 : 8분음표 단위로 편집? or 16분음표 단위로 편집?
        this.msec4Quaver = note_size;
        console.log("-- quaver size(msec) :", this.msec4Quaver);
    },
    set_wordSize: (word_size) => {        // 1마디 당 음표 갯수 - 4/4박자면, 8분음표 8개,  3/4박자면, 8분음표 6개, etc...
        this.numQuaver4Word = word_size;
        console.log("-- word size(unit:quaver) :", this.numQuaver4Word);
    },
    set_semiQuaver: (semi) => {
        this.semiQuaverMode = (semi)? true : false;
    },
    zoom_in: () => {
        if (this.numSmp4Px > 2) {
            this.numSmp4Px /= 2;
        }
        console.log("numSmp4Px :" + this.numSmp4Px);
    },
    zoom_out: () => {
        if (this.numSmp4Px < 2048) {
            this.numSmp4Px *= 2;
        }
        console.log("numSmp4Px :" + this.numSmp4Px);
    },
    get_msecPerPixel: () => {
        return ( (this.numSmp4Px * 1000) / this.samplerate) ;        // 1pixel 에 해당하는 msec 시간
    }
};

function makeTimeString (msec) {
    let min = ""+parseInt(msec/60000);
    let sec = ""+parseInt(parseInt(msec%60000)/1000);
    let milli = ""+parseInt(msec%1000);
    let retString = min+":"+sec.padStart(2,'0')+"."+milli.padStart(3,"0");
    return retString;
};
