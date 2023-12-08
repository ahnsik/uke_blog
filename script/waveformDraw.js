/* ================================
    WAVEFORM 을 그리는 함수 분리함.
================================ */

const TAB_LYRIC = 0;
const TAB_CHORD = (TAB_LYRIC+28);
const TAB_STROKE = (TAB_CHORD+28);
const TAB_TECHNIC = (TAB_STROKE+28);
const TAB_LINE_A = (TAB_TECHNIC+36);
const TAB_LINE_E = (TAB_LINE_A+30);
const TAB_LINE_C = (TAB_LINE_E+30);
const TAB_LINE_G = (TAB_LINE_C+30);
const TABULATE_HEIGHT = (TAB_LINE_G+30);

const TAB_BGCOLOR = "lavender";                // 
const TAB_BGCOLOR_BEAT = "lightsteelblue";       //
const BGCOLOR_LYRIC = "khaki";             // 약간 탁한 노랑
const BGCOLOR_CHORD = "antiquewhite";      // 더 밝은 오렌지
const BGCOLOR_CHORD_BEAT = "bisque";       // 밝은 오렌지
const BGCOLOR_STROKE = "lemonchiffon";     // 밝고 흐린 노랑
const BGCOLOR_STROKE_BEAT = "palegoldenrod"; // 밝고 탁한 노랑
const BGCOLOR_TECHNIC = "wheat";           // 쿨피스 자두맛 

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
    scaleFactor: 0.5,
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
        this.scaleFactor = 0.5;
        this.x = 0; 
        this.y = 0;
        this.w = 800;
        this.h = 200;
    }, 
    drawWave: (ctx) => {
        let waveSize = this.h - TABULATE_HEIGHT;
        let xpos = this.x-0.5;     // 단지 draw를 하기 위해 위치 보정
        let center_y = (this.y+waveSize)/2;  // canvas center 에 그리기 위해서 
        let i, j, min, max, value;
        let offset = (( (this.scrollOffset-this.startOffset) * this.samplerate) / 1000);        // let numSmp4msec = this.samplerate / 1000;

        for (i=1; i<(this.w-this.x); i++ ) {
            let start_idx = parseInt( this.numSmp4Px*(i-1) +offset );       // offset 은 waveBuffer의 index (sample단위)
            if (start_idx >= this.waveBuffer.length)  break;                // wave data 의 끝까지 왔으면 더이상 그릴 게 없으므로 종료.
            let end_idx =  parseInt( this.numSmp4Px*i +offset );

            if ( (start_idx < 0) ) { //|| (end_idx >= this.waveBuffer.length) ) {   // 범위를 벗어나면.. 0 값으로.
                min = max = 0.0;
            } else {
                min=9999.0;
                max=-9999.0;
                for (j = start_idx; j<end_idx; j++) {
                    value = this.waveBuffer[j]*this.scaleFactor;
                    if ( value >= max)
                      max = value;      //parseInt(value);
                    if ( value <= min)
                      min = value;      //parseInt(value);
                }
            }
            ctx.beginPath();
            if ( (start_idx/this.samplerate) < this.currPos ) {      // play 지나간
                ctx.strokeStyle = "gray";
            } else if ( (parseInt(start_idx/this.samplerate) % 2) == 0 ) {    // 짝수 초(sec)라면 파랑. 아니면 녹색으로 표시 
                ctx.strokeStyle = "darkblue";       
            } else {
                ctx.strokeStyle = "darkslateblue";
            }
            ctx.moveTo( xpos+i, center_y + min*waveSize);
            ctx.lineTo( xpos+i, center_y + max*waveSize);
            ctx.stroke();
        }
    },

    drawBg: (ctx) => {
        // 배경에 박자에 따라 마디 배경 그려줄 함수.
        let xpos = this.x-0.5;     // 단지 draw를 하기 위해 위치 보정
        let msec_per_pixel = this.numSmp4Px * 1000 / this.samplerate ;        // 1pixel 에 해당하는 msec 시간

        let edit_unit;
        switch(this.numQuaver4Word) {
            case 8:         // 1 마디 당 8분음표 8개 = 8분음표 기준 편집.
                edit_unit = 8; break;
            case 16:        // 1 마디 당 8분음표 16개 = 16분음표 기준 편집.
            case 6:         // 1 마디 당 8분음표 6개 = 8분음표 기준 편집, 3/4 박자.
            case 12:        // 1 마디 당 8분음표 12개 = 16분음표 기준 편집, 3/4 박자. ?
        }
        let msec_perGrid = (this.semiQuaverMode)?this.msec4Quaver*2 : this.msec4Quaver;

        let prev_beat = 15;
        for (i=1; i<(this.w-this.x); i++ ) {
            let beat = parseInt( (i*msec_per_pixel+this.scrollOffset) / (msec_perGrid/2) ) % this.numQuaver4Word;      // 1 마디를 8분음표로 나눈 갯수...
            if (prev_beat != beat) {
                ctx.fillStyle = "grey";
                ctx.fillRect( xpos+i, this.y, 1, this.h );
                prev_beat = beat;
            } else {
                let y = 0;
                if (beat == 0) {        // 마디 의 첫 비트
                    ctx.fillStyle = TAB_BGCOLOR_BEAT;
                    ctx.fillRect( xpos+i, y, 1, (this.h-TABULATE_HEIGHT) );         // TODO: y, h를 반복계산하지 않도록 정리가 필요.
                    y+=(this.h-TABULATE_HEIGHT);
                    ctx.fillStyle = BGCOLOR_LYRIC;
                    ctx.fillRect( xpos+i, y, 1, TAB_LYRIC);         // TODO: y, h를 반복계산하지 않도록 정리가 필요.
                    y+=TAB_LYRIC;
                    ctx.fillStyle = BGCOLOR_CHORD_BEAT;
                    ctx.fillRect( xpos+i, y, 1, TAB_CHORD);         // TODO: y, h를 반복계산하지 않도록 정리가 필요.
                    y+=TAB_CHORD;
                    ctx.fillStyle = BGCOLOR_STROKE_BEAT;
                    ctx.fillRect( xpos+i, y, 1, TAB_STROKE);         // TODO: y, h를 반복계산하지 않도록 정리가 필요.
                    y+=TAB_STROKE;
                    ctx.fillStyle = BGCOLOR_TECHNIC;
                    ctx.fillRect( xpos+i, y, 1, TAB_TECHNIC);         // TODO: y, h를 반복계산하지 않도록 정리가 필요.
                    y+=TAB_TECHNIC;
                } else {
                    ctx.fillStyle = TAB_BGCOLOR;
                    ctx.fillRect( xpos+i, y, 1, (this.h-TABULATE_HEIGHT) );         // TODO: y, h를 반복계산하지 않도록 정리가 필요.
                    y+=(this.h-TABULATE_HEIGHT);
                    ctx.fillStyle = BGCOLOR_LYRIC;
                    ctx.fillRect( xpos+i, y, 1, TAB_LYRIC);         // TODO: y, h를 반복계산하지 않도록 정리가 필요.
                    y+=TAB_LYRIC;
                    ctx.fillStyle = BGCOLOR_CHORD;
                    ctx.fillRect( xpos+i, y, 1, TAB_CHORD);         // TODO: y, h를 반복계산하지 않도록 정리가 필요.
                    y+=TAB_CHORD;
                    ctx.fillStyle = BGCOLOR_STROKE;
                    ctx.fillRect( xpos+i, y, 1, TAB_STROKE);         // TODO: y, h를 반복계산하지 않도록 정리가 필요.
                    y+=TAB_STROKE;
                    ctx.fillStyle = BGCOLOR_TECHNIC;
                    ctx.fillRect( xpos+i, y, 1, TAB_TECHNIC);         // TODO: y, h를 반복계산하지 않도록 정리가 필요.
                    y+=TAB_TECHNIC;
                }
            }
        }
    },

    drawNotes: (ctx, json_data) => {
        let ypos = this.h - TABULATE_HEIGHT;
        ctx.fillStyle = "gray";
        // 윗경계
        ctx.fillRect( this.x, ypos, this.w, 4 );
        // TAB Line
        ctx.fillStyle = "black";
        ctx.fillRect( this.x+32, ypos+TAB_LINE_A, this.w, 2 );     // A
        ctx.fillRect( this.x+32, ypos+TAB_LINE_E, this.w, 2 );     // E
        ctx.fillRect( this.x+32, ypos+TAB_LINE_C, this.w, 2 );     // C
        ctx.fillRect( this.x+32, ypos+TAB_LINE_G, this.w, 2 );    // G

        // 본격적으로 note 데이터를 표시해 보자.
        let xpos = this.x-0.5;     // 단지 draw를 하기 위해 위치 보정
        let msec_per_pixel = this.numSmp4Px * 1000 / this.samplerate ;        // 1pixel 에 해당하는 msec 시간
        let notes = json_data.notes;

        // let backupFont = ctx.font;
        // ctx.fillStyle = "black";

        for (i=0; i<(this.w-this.x); i++ ) {
            let msec = parseInt( (i*this.numSmp4Px) * 1000 / this.samplerate )+this.scrollOffset;         // i 번째 픽셀의 msec 값
            for (j=0; j<notes.length; j++) {
                let diff = notes[j].timestamp - msec;
                if ( (diff >= 0) && (diff < msec_per_pixel) ) {       // 1픽셀 안에 악보 데이터의 timeStamp 가 들어 오면..
                    draw_a_note(ctx, xpos+i, ypos+30, notes[j] );
                    // if ( (notes[j].lyric!=undefined)&&(notes[j].lyric!=null) ) {
                    //     ctx.font = "22px Arial";
                    //     ctx.fillText( notes[j].lyric, xpos+i, ypos+30 );
                    // }
                
                    break;
                }
            }
        }
        // ctx.font = backupFont;
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
        let ypos = this.h - TABULATE_HEIGHT - 16;

        ctx.fillStyle = "black";
        let prev_time = 0;
        for (i=0; i<(this.w-this.x); i++ ) {
            let msec = parseInt( (i*this.numSmp4Px) * 1000 / this.samplerate )+this.scrollOffset;         // i 번째 픽셀의 msec 값
            if ( parseInt(msec/rulerGridSize) != parseInt(prev_time/rulerGridSize) ) {          //     rulerGridSize: 500,
                ctx.fillText( makeTimeString(msec), xpos+i, ypos+6);
                ctx.fillText( makeTimeString(msec), xpos+i, 3);
                prev_time = msec;
            }
        }
    },

    // draw: (ctx, json_data) => {
    //     console.log("drawBG=", this.drawBg, ", type=", typeof(this.drawBg) );
    //     this.drawBg(ctx);
    //     this.drawWave(ctx);
    //     this.drawNotes(ctx, json_data);
    //     this.drawRuler(ctx);
    // }, 

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
        if (offset >= 0)
            this.scrollOffset = offset;
    },
    get_scrollPos: () => {
        return parseInt(this.scrollOffset);
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
    },
    get_msecPerGrid: () => {
        let msec_perGrid = (this.semiQuaverMode)?this.msec4Quaver : this.msec4Quaver/2;
        return msec_perGrid;
    },
    set_wordSize: (word_size) => {        // 1마디 당 음표 갯수 - 4/4박자면, 8분음표 8개,  3/4박자면, 8분음표 6개, etc...
        this.numQuaver4Word = word_size;
    },
    set_semiQuaver: (semi) => {
        this.semiQuaverMode = (semi)? true : false;
    },
    zoom_in: () => {
        if (this.numSmp4Px > 2) {
            this.numSmp4Px /= 1.2;
        }
        console.log("numSmp4Px :" + this.numSmp4Px);
    },
    zoom_out: () => {
        if (this.numSmp4Px < 2048) {
            this.numSmp4Px *= 1.2;
        }
        console.log("numSmp4Px :" + this.numSmp4Px);
    },
    set_scaleFactor: (factor) => {
        this.scaleFactor = factor;
    },
    get_msecPerPixel: () => {
        return ( (this.numSmp4Px * 1000) / this.samplerate) ;        // 1pixel 에 해당하는 msec 시간
    },

    get_clickedCategory: (ypos) => {
        let size = (this.h-TABULATE_HEIGHT);
        if (ypos < size)
            return "waveform";
        size += TAB_LYRIC;
        if (ypos < size)
            return "lyric";
        size += TAB_CHORD;
        if (ypos < size)
            return "chord";
        size += TAB_STROKE;
        if (ypos < size)
            return "stroke";
        size += TAB_TECHNIC;
        if (ypos < size)
            return "technic";
        size += TAB_CHORD;
        if (ypos < size)
            return "chord";
        size += TAB_LINE_A;
        if (ypos < size)
            return "line_a";
        size += TAB_LINE_E;
        if (ypos < size)
            return "line_e";
        size += TAB_LINE_C;
        if (ypos < size)
            return "line_c";
        size += TAB_LINE_G;
        if (ypos < size)
            return "line_g";
        return "unknown";
    },
    get_clickedTimeStamp: (xpos) => {
        let msec = parseInt( ( xpos*this.numSmp4Px) * 1000 / this.samplerate )+this.scrollOffset;         // i 번째 픽셀의 msec 값
        return msec;
    }
};

////////////////////////////////////
//// localy used utility functions..
function makeTimeString (msec) {
    let min = ""+parseInt(msec/60000);
    let sec = ""+parseInt(parseInt(msec%60000)/1000);
    let milli = ""+parseInt(msec%1000);
    let retString = "▲"+min+":"+sec.padStart(2,'0')+"."+milli.padStart(3,"0");
    return retString;
};
function isEmptyStr(str) {
    if (str==undefined)
        return true;
    if (str==null)
        return true;
    if (str.length==0)
        return true;
    if (str=="")
        return true;
    return false;
}
function draw_a_note (ctx, x, y, note) {
    let backupFont = ctx.font;
    ctx.font = "22px Arial";

    if ( ! isEmptyStr(note.lyric) ) {
        ctx.fillText( note.lyric, x, y+TAB_LYRIC );
    }
    if ( ! isEmptyStr(note.chord) ) {
        ctx.fillText( note.chord, x, y+TAB_CHORD );
    }
    if ( ! isEmptyStr(note.stroke) ) {
        ctx.fillText( note.stroke, x, y+TAB_STROKE );
    }
    if ( ! isEmptyStr(note.technic) ) {
        ctx.fillText( note.technic, x, y+TAB_TECHNIC );
    }

    if ( note.tab != undefined ) {
        if (note.tab.length > 0) {
            // console.log("ts=", note.timestamp, ", len=", note.tab.length, ", tab = ", note.tab );
            for (k=0; k<note.tab.length; k++) {
                let noteStr = note.tab[k];
                if (!isEmptyStr(noteStr)) {
                    if (noteStr.charAt(0)=="A") {
                        ctx.fillText(noteStr, x, y+TAB_LINE_A);
                    }
                    if (noteStr.charAt(0)=="E") {
                        ctx.fillText(noteStr, x, y+TAB_LINE_E);
                    }
                    if (noteStr.charAt(0)=="C") {
                        ctx.fillText(noteStr, x, y+TAB_LINE_C);
                    }
                    if (noteStr.charAt(0)=="G") {
                        ctx.fillText(noteStr, x, y+TAB_LINE_G);
                    }
                }
            }
        }
    }
    ctx.font = backupFont;
};
