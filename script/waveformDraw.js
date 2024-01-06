/* ================================
    WAVEFORM 을 그리는 함수 분리함.
================================ */

const FLAG_WAVE = 0;
const FLAG_LYRIC = 1;
const FLAG_CHORD = 2;
const FLAG_STROKE = 3;
const FLAG_TECHNIC = 4;
const FLAG_NOTES_A = 5;
const FLAG_NOTES_E = 6;
const FLAG_NOTES_C = 7;
const FLAG_NOTES_G = 8;

const LYRIC_HEIGHT = 32;
const CHORD_HEIGHT = 32;
const STROKE_HEIGHT = 32;
const TECHNIC_HEIGHT = 32;
const NOTES_HEIGHT = 128;           // (45+30+30+45)
const LINE_A_OFFSET = NOTES_HEIGHT+16;
const LINE_E_OFFSET = NOTES_HEIGHT+48;
const LINE_C_OFFSET = NOTES_HEIGHT+80;
const LINE_G_OFFSET = NOTES_HEIGHT+112;

// const COMPONENT_HEIGHT = (LYRIC_HEIGHT+CHORD_HEIGHT+STROKE_HEIGHT+TECHNIC_HEIGHT+NOTES_HEIGHT);
const COMPONENT_HEIGHT = 256;       // tab_notes.png - image height

const TAB_LABEL_WIDTH = 36;
const TAB_BGCOLOR = "lavender";                // 
const TAB_BGCOLOR_BEAT = "lightsteelblue";       //
const BGCOLOR_LYRIC = "khaki";             // 약간 탁한 노랑
const BGCOLOR_CHORD = "antiquewhite";      // 더 밝은 오렌지
const BGCOLOR_CHORD_BEAT = "bisque";       // 밝은 오렌지
const BGCOLOR_STROKE = "lemonchiffon";     // 밝고 흐린 노랑
const BGCOLOR_STROKE_BEAT = "palegoldenrod"; // 밝고 탁한 노랑
const BGCOLOR_TECHNIC = "wheat";           // 쿨피스 자두맛 

var waveformDraw = {
    icon_src: null,
    // audio 속성들..
    waveBuffer: [],     // FloatArray
    samplerate: 44100,  // Audio SampleRate
    currPos: 0,         // 현재 play 중인 위치.
    scrollOffset: 0,     // Scroll 되어 drawing을 시작할 msec
    startOffset: 0,     // waveform 과 박자 grid 의 시간 차이 보정.
    focus_msec: 0,      // 커서 포커스가 위치하는 timeline.
    focused_line: "",
    focused_index: -1,
    numSmp4Px: 256,     // 1 pixel 당 smaple 수. = drawing 의 기준. 
    msec_per_pixel: 0,  // need to be re-calculated with 'numSmp4Px'
    msec4Quaver: 500,   // 8분음표에 해당하는 시간(msec)   - default: 60 bpm 일 때, 4분음표는 1초, 즉, 8분음표는 0.5초
    semiQuaverMode: false,  // 16분음표 편집 모드(=true) 또는 8분음표 편집 모드(=false)
    msec_perGrid: 0,    // need to be re-calculated with 'msec4Quaver' or 'semiQuaverMode', etc..
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
        this.icon_src = document.getElementById("uke_note");
        this.waveBuffer = [];
        this.samplerate = 48000;
        this.currPos = 0;
        this.scrollOffset = 0;
        this.startOffset = 0;
        this.focus_msec = 0;
        this.focused_index = -1;
        this.numSmp4Px = 256;
        this.msec4Quaver = 500;
        this.semiQuaverMode = false,
        this.numQuaver4Word = 8;
        this.scaleFactor = 0.5;
        this.x = 0; 
        this.y = 0;
        this.w = 800;
        this.h = 200;

        this.msec_per_pixel = (this.numSmp4Px * 1000 / this.samplerate) ;        // 1pixel 에 해당하는 msec 시간
        this.msec_perGrid = (this.semiQuaverMode)?this.msec4Quaver : this.msec4Quaver/2;
    }, 

    drawBg: (ctx) => {
        // let icon_src = document.getElementById("uke_note");
        // 배경에 박자에 따라 마디 배경 그려줄 함수.
        let edit_unit = (this.semiQuaverMode)?8:16;
        let xpos = this.x+TAB_LABEL_WIDTH-1;
        let loop_w = (this.w-xpos);

        let prev_beat = 0;     // quaver 간의 경계선 그리기 위해서..
        let ypos = this.y;
        let wave_height = this.h-COMPONENT_HEIGHT;

        for (i=0; i<loop_w; i++ ) {
            let beat = parseInt( (i*this.msec_per_pixel+this.scrollOffset) / this.msec_perGrid ) % edit_unit;      // 1 마디를 8분음표로 나눈 갯수...
            let xx = xpos+i;
            if (prev_beat != beat) {    // 음표 구분.. 
                ctx.fillStyle = "grey";
                ctx.fillRect( xx, ypos, 1, this.h );
                prev_beat = beat;
            } else {
                if (beat == 0) {        // 마디 의 첫 비트 - 하이라이트 - 마디(WORD) 구분
                    draw_bg_vline_hilight (ctx, xx, ypos, wave_height);
                } else {
                    draw_bg_vline(ctx, xx, ypos, wave_height);
                }
            }
        }

        // drawing cursor pos.
        let focus_start = parseInt(this.focus_msec/this.msec_perGrid) * this.msec_perGrid;
        // console.log("[][] focus msec = ", this.focus_msec, " gridsize=", this.msec_perGrid );
        let x = (focus_start-this.scrollOffset) / this.msec_per_pixel;
        let w = this.msec_perGrid / this.msec_per_pixel;
        ctx.fillStyle = "burlywood";    //"steelblue";
        ctx.fillRect(x+TAB_LABEL_WIDTH, 0, w, this.h);
    },
    drawWave: (ctx) => {
        let waveSize = this.h - COMPONENT_HEIGHT;
        let xpos = this.x-0.5+TAB_LABEL_WIDTH;     // 0.5는 단지 draw를 하기 위해 위치 보정
        let center_y = (this.y+waveSize)/2;  // canvas center 에 그리기 위해서 
        let i, j, min, max, value;
        let offset = (( (this.scrollOffset-this.startOffset) * this.samplerate) / 1000);        // let numSmp4msec = this.samplerate / 1000;
        let loop_w = (this.w-xpos);

        for (i=1; i<loop_w; i++ ) {
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
    drawNotes: (ctx, json_data) => {
        let ypos = this.h - NOTES_HEIGHT;
        // 윗경계
        ctx.fillStyle = "gray";
        ctx.fillRect( this.x+TAB_LABEL_WIDTH-1, ypos, this.w, 4 );

        // 본격적으로 note 데이터를 표시해 보자.
        let notes = json_data.notes;

        ypos = this.h - COMPONENT_HEIGHT;

        for (j=0; j<notes.length; j++) {
            let x = (notes[j].timestamp-this.scrollOffset)/this.msec_per_pixel + TAB_LABEL_WIDTH;
            let played = (notes[j].timestamp < (this.currPos*1000) )?"past":"normal";
            if (x < this.w) {
                if (j===this.focused_index) {
                    draw_a_note(ctx, x, ypos, this.msec_perGrid/this.msec_per_pixel, notes[j], "focused");
                } else 
                    draw_a_note(ctx, x, ypos, this.msec_perGrid/this.msec_per_pixel, notes[j], played);
            }
        }

        // LEFT SIDE - LABEL Area.
        ctx.drawImage(this.icon_src, 0, 0, TAB_LABEL_WIDTH, 256, this.x, this.y+this.h-COMPONENT_HEIGHT, TAB_LABEL_WIDTH, 256);
        ctx.fillStyle = "lightgray";
        ctx.fillRect(0, 0, TAB_LABEL_WIDTH, this.y+this.h-COMPONENT_HEIGHT);
        ctx.font = "8px sanserif gray";
        ctx.textAlign = "right";
        ctx.fillText("waveform", 2+30, this.y+COMPONENT_HEIGHT/2);
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

        let xpos = this.x+TAB_LABEL_WIDTH-1;
        let ypos = this.h - COMPONENT_HEIGHT - 16;
        let loop_w = (this.w-xpos);

        ctx.fillStyle = "black";
        let prev_time = 0;
        for (i=0; i<loop_w; i++ ) {
            let msec = parseInt( (i*1000 * this.numSmp4Px) / this.samplerate )+this.scrollOffset;         // i 번째 픽셀의 msec 값
            if ( parseInt(msec/rulerGridSize) != parseInt(prev_time/rulerGridSize) ) {          //     rulerGridSize: 500,
                ctx.fillText( makeTimeString(msec), xpos+i, ypos+6);
                ctx.fillText( makeTimeString(msec), xpos+i, 3);
                prev_time = msec;
            }
        }
    },

    set_audioBuffer: (buf, sample_rate) => {
        this.waveBuffer = buf;
        this.samplerate = sample_rate;
        this.numSmp4Px = 256;
        this.msec_per_pixel = (1000 * this.numSmp4Px / this.samplerate) ;        // numSmp4Px 값이 바뀌면 새로 계산 해야 함.
    },
    set_windowSize: (x, y, w, h) => {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    },
    get_drawingOffset: () => {
        return { x: TAB_LABEL_WIDTH, y: 0 }
    },
    set_focusPos: (offset) => {
        if (offset >= 0)
            this.focus_msec = offset;
    },
    get_focusPos_msec: () => {
        return this.focus_msec;
    },
    set_focusIndex: (index) => {
        this.focused_index = index;
    },
    // get_focusIndex: () => {
    //     return this.focused_index;
    // },
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
        this.msec_perGrid = (this.semiQuaverMode)?this.msec4Quaver : this.msec4Quaver/2;
    },
    get_msecPerPixel: () => {
        return this.msec_per_pixel;     // = (1000 * this.numSmp4Px / this.samplerate) ;
    },
    get_msecPerGrid: () => {
        return this.msec_perGrid;
    },
    set_wordSize: (word_size) => {        // 1마디 당 음표 갯수 - 4/4박자면, 8분음표 8개,  3/4박자면, 8분음표 6개, etc...
        this.numQuaver4Word = word_size;
    },
    set_semiQuaver: (semi) => {
        this.semiQuaverMode = (semi)? true : false;
        this.msec_perGrid = (this.semiQuaverMode)?this.msec4Quaver : this.msec4Quaver/2;
    },
    zoom_in: () => {
        if (this.numSmp4Px > 2) {
            this.numSmp4Px /= 1.2;
            this.msec_per_pixel = (1000 * this.numSmp4Px / this.samplerate) ;        // numSmp4Px 값이 바뀌면 새로 계산 해야 함.
        }
        console.log("numSmp4Px :" + this.numSmp4Px);
    },
    zoom_out: () => {
        if (this.numSmp4Px < 2048) {
            this.numSmp4Px *= 1.2;
            this.msec_per_pixel = (1000 * this.numSmp4Px / this.samplerate) ;        // numSmp4Px 값이 바뀌면 새로 계산 해야 함.
        }
        console.log("numSmp4Px :" + this.numSmp4Px);
    },
    set_scaleFactor: (factor) => {
        this.scaleFactor = factor;
    },

    set_focusCategory: (focus_line) => {
        this.focused_line = focus_line;
    },

    get_clickedCategory: (ypos) => {
        let size = (this.h-COMPONENT_HEIGHT);
        if (ypos < size)
            return FLAG_WAVE;
        size += LYRIC_HEIGHT;
        if (ypos < size)
            return FLAG_LYRIC;
        size += CHORD_HEIGHT;
        if (ypos < size)
            return FLAG_CHORD;
        size += STROKE_HEIGHT;
        if (ypos < size)
            return FLAG_STROKE;
        size += TECHNIC_HEIGHT;
        if (ypos < size)
            return FLAG_TECHNIC;
        // size += CHORD_HEIGHT;
        // if (ypos < size)
        //     return "chord";
        size += LINE_A_OFFSET;
        if (ypos < size)
            return FLAG_NOTES_A;
        size += LINE_E_OFFSET;
        if (ypos < size)
            return FLAG_NOTES_E;
        size += LINE_C_OFFSET;
        if (ypos < size)
            return FLAG_NOTES_C;
        size += LINE_G_OFFSET;
        if (ypos < size)
            return FLAG_NOTES_G;
        return FLAG_WAVE;
    },
    get_clickedTimeStamp: (xpos) => {
        let msec = parseInt( xpos*1000 * this.numSmp4Px / this.samplerate )+this.scrollOffset;         // i 번째 픽셀의 msec 값
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


const lyric_color = "#FFE994";
const chord_color = "#FFDBB6";
const stroke_color = "#DEE7E5";
const technic_color = "#DDE8CB";
const TAB_BG_COLOR = "#EEEEEE";

const lyric_color_hi = "#e0d080";
const chord_color_hi = "#e0c0a0";
const stroke_color_hi = "#c0e0e0";
const technic_color_hi = "#c0e0b0";
const TAB_BG_COLOR_hi = "#d0d0d0";

// 배경이 되는 세로 1 라인을 그림. - 미리 준비된 bitmap 으로 부터 copy 하거나, 직접 영역 별로 색상을 구분해서 그려 보거나.
// - 성능 비교할 것 : 비교 결과.. 큰 차이는 없는 듯..
function draw_bg_vline_hilight (ctx, x, y, wave_height) {
    //  미리 준비된 비트맵을 copy 하는경우.
    ctx.drawImage(this.icon_src, 37, 0, 1, 256, x, y+wave_height, 1, 256);
    ctx.fillStyle = TAB_BGCOLOR_BEAT;
    ctx.fillRect( x, y, 1, wave_height );

    // //  bitmap copy 하지 않고 직접 색깔별로 line 을 그리는 경우.
    // ctx.fillStyle = TAB_BGCOLOR_BEAT;           // wave form BG
    // ctx.fillRect( x, y, 1, wave_height );
    // y += wave_height;
    // ctx.fillStyle = lyric_color_hi;
    // ctx.fillRect( x, y, 1, 32);
    // y += 32;
    // ctx.fillStyle = chord_color_hi;
    // ctx.fillRect( x, y, 1, 32);
    // y += 32;
    // ctx.fillStyle = stroke_color_hi;
    // ctx.fillRect( x, y, 1, 32);
    // y += 32;
    // ctx.fillStyle = technic_color_hi;
    // ctx.fillRect( x, y, 1, 32);
    // y += 32;
    // ctx.fillStyle = TAB_BG_COLOR_hi;
    // ctx.fillRect( x, y, 1, 128);
    // // y += 128;
}


function draw_bg_vline (ctx, x, y, wave_height) {
    //  미리 준비된 비트맵을 copy 하는경우.
    ctx.drawImage(this.icon_src, 33, 0, 1, 256, x, y+wave_height, 1, 256); // TODO: 비트맵 이미지 대신 라인으로 직접그릴 수 있게 함수화 해 볼 것
    ctx.fillStyle = TAB_BGCOLOR;
    ctx.fillRect( x, y, 1, wave_height );

    // //  bitmap copy 하지 않고 직접 색깔별로 line 을 그리는 경우.
    // ctx.fillStyle = TAB_BGCOLOR;           // wave form BG
    // ctx.fillRect( x, y, 1, wave_height );
    // y += wave_height;
    // ctx.fillStyle = lyric_color;
    // ctx.fillRect( x, y, 1, 32);
    // y += 32;
    // ctx.fillStyle = chord_color;
    // ctx.fillRect( x, y, 1, 32);
    // y += 32;
    // ctx.fillStyle = stroke_color;
    // ctx.fillRect( x, y, 1, 32);
    // y += 32;
    // ctx.fillStyle = technic_color;
    // ctx.fillRect( x, y, 1, 32);
    // y += 32;
    // ctx.fillStyle = TAB_BG_COLOR;
    // ctx.fillRect( x, y, 1, 128);
    // // y += 128;
}



function draw_a_note (ctx, x, y, w, note, played) {
    let backupFont = ctx.font;
    let ypos = y;
    let focus_color = "black";
    ctx.font = "22px Arial";
    focused = this.focused_line;

    if (played=="past") {
        focus_color = "gray";
    } else if (played=="focused") {
        focus_color = "red";
        ctx.font = "30px Arial bold";
        ctx.strokeStyle = "red";
        ctx.strokeRect(x, y, w, COMPONENT_HEIGHT );
    } else {
        focus_color = "black";
    }
    if ( ! isEmptyStr(note.lyric) ) {
        if (focused == FLAG_LYRIC)
            ctx.fillStyle = focus_color;
        else 
            ctx.fillStyle = "black";
        ctx.fillText( note.lyric, x, ypos );
    }
    ypos+=LYRIC_HEIGHT;
    if ( ! isEmptyStr(note.chord) ) {
        if (focused == FLAG_CHORD)
            ctx.fillStyle = focus_color;
        else 
            ctx.fillStyle = "black";
        ctx.fillText( note.chord, x, ypos );
    }
    ypos+=CHORD_HEIGHT;
    if ( ! isEmptyStr(note.stroke) ) {
        if (focused == FLAG_STROKE)
            ctx.fillStyle = focus_color;
        else 
            ctx.fillStyle = "black";
        ctx.fillText( note.stroke, x, ypos );
    }
    ypos+=STROKE_HEIGHT;
    if ( ! isEmptyStr(note.technic) ) {
        if (focused == FLAG_TECHNIC)
            ctx.fillStyle = focus_color;
        else 
            ctx.fillStyle = "black";
        ctx.fillText( note.technic, x, ypos );
    }
    ypos+=TECHNIC_HEIGHT;

    // ypos = y+(LYRIC_HEIGHT+CHORD_HEIGHT+STROKE_HEIGHT+TECHNIC_HEIGHT);
    if ( note.tab != undefined ) {
        if (note.tab.length > 0) {
            // console.log("ts=", note.timestamp, ", len=", note.tab.length, ", tab = ", note.tab );
            for (k=0; k<note.tab.length; k++) {
                let noteStr = note.tab[k];
                if (!isEmptyStr(noteStr)) {
                    if (noteStr.charAt(0)=="A") {
                        if (focused == FLAG_NOTES_A)
                            ctx.fillStyle = focus_color;
                        else 
                            ctx.fillStyle = "black";
                        ctx.fillText(noteStr, x, ypos+LINE_A_OFFSET-10);
                    }
                    if (noteStr.charAt(0)=="E") {
                        if (focused == FLAG_NOTES_E)
                            ctx.fillStyle = focus_color;
                        else 
                            ctx.fillStyle = "black";
                        ctx.fillText(noteStr, x, ypos+LINE_E_OFFSET-10);
                    }
                    if (noteStr.charAt(0)=="C") {
                        if (focused == FLAG_NOTES_C)
                            ctx.fillStyle = focus_color;
                        else 
                            ctx.fillStyle = "black";
                        ctx.fillText(noteStr, x, ypos+LINE_C_OFFSET-10);
                    }
                    if (noteStr.charAt(0)=="G") {
                        if (focused == FLAG_NOTES_G)
                            ctx.fillStyle = focus_color;
                        else 
                            ctx.fillStyle = "black";
                        ctx.fillText(noteStr, x, ypos+LINE_G_OFFSET-10);
                    }
                }
            }
        }
    }
    ctx.font = backupFont;
};
