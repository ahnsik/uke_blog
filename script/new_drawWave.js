/* MP3 file waveform drawing based on msec. with ruller.
    millisecond 를 기준으로 정확한 grid 로 waveform 을 그리기 위한 함수.
*/


var wavDrawProperty = {
    rulerGrid: 2000,
    pixelSize: 8,
    quaverSizeMsec: 500,
    wordSizeQuaver: 8,  
    focused_pos: 3600,

    ctx:"",
    draw: function(wavBuffer) {
        draw_mp3Wav(wavBuffer);
    }
};

// 단위는 무조건 msec 단위로 할 것.
let g_rulerGrid = 2000;         // 1000msec 마다 눈금자를 그린다.   --> 최소 800msec 이하로 가지 말 것. - 글자가 안 보이게 됨.
let g_pixel_size = 8;           // 1 pixel 당 msec 값.

let g_quaver_size = 500;        // 4분의 4박자, 60bpm 이라면  4분음표=1초. 8분음표를 기준으로 하면, 500msec
let g_NumQuaver_per_word = 8;    // 한 마디에 8분음표 갯수. 4분의 4박자 = 8

let g_focused = 3600;


  
var draw_mp3Wav = (wavBuffer) => {

    // recalcurate units.
    let _bakja = document.getElementById("signature").value;
    let _bunja = _bakja.split('/')[0];
    let _bunmo = _bakja.split('/')[1];
    let _quaver_mode = (document.getElementById("quaver_mode").selectedIndex == 0)?8:16;
    g_NumQuaver_per_word = parseInt( _quaver_mode*_bunja / _bunmo);        // 1 마디 당, 8분음표의 갯수, if 16비트 편집이면, 8* 를 16* 로 바꿔야 하는데..
    g_quaver_size = parseInt( ((_quaver_mode==8)?500:250)*60/g_bpm);

    let scrollPosDisplay = document.getElementById("scrollPos");
    scrollPosDisplay.innerText = "index="+scrollPosition+", msec="+(scrollPosition/g_sampleRate);
    let canvas = document.getElementById("canvas_waveform");
    // canvas.width = canvas_width;
    // canvas.height = canvas_height;
    let ctx = canvas.getContext("2d");
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    ctx.imageSmoothingEnabled= false;

    ctx.fillRect(START_XPOS, CHORD_ICON_Y, 20, 40 );
    msec_ruller(ctx, START_XPOS, 10, canvas_width, 5, wavBuffer);
}

var msec_ruller = (ctx, x,y, w,h, wavBuffer ) => {
    let backup_fillStyle = ctx.fillStyle;
    ctx.fillStyle = "darkgray";
    let scrollPosMsec = scrollPosition/g_numSmp_per_px;
    console.log("scrollPosition="+scrollPosMsec);     // TODO: scrollPosition 도 msec 단위로 다시 바꿔여 한다.  이전엔 scrollPosition 은 sample 갯수 단위였음

    for (let i=0; i<w; i++) {
        let msec = i*g_pixel_size +scrollPosMsec;
        if ( (msec%g_rulerGrid)<g_pixel_size ) {        // 정수 계산이 잘 안 먹히므로.
            ctx.fillRect(x+i,y,1,7);
            if (msec > 0)
                ctx.fillText(make_msec_string(msec), x+i, y+10);
        } else if ( (msec%(g_rulerGrid/4))<g_pixel_size ) {    
            ctx.fillRect(x+i,y,1,7);
    
        } else {
            ctx.fillRect(x+i,y,1,3);
        }
    }

    for (let i=0; i<w; i++) {
        let msec = i*g_pixel_size +scrollPosMsec;

        if ( Math.abs(g_focused-msec) < g_pixel_size ) {
            ctx.fillStyle = "red";          // area selected.
        } else if ( (msec%g_quaver_size) < g_pixel_size ) {
            ctx.fillStyle = QUAVER_GRID_COLOR;      // "blue";
        } else if ( (msec>g_selection_start)&&(msec<g_selection_end) ) {
            ctx.fillStyle = "yellow";          // area selected.
        } else if ( parseInt(msec/g_quaver_size) % g_NumQuaver_per_word == 0 ) {
            ctx.fillStyle = QUAVER_BG_COLOR;      // "cyan";
        } else {
            ctx.fillStyle = "lightgray";
        }
        ctx.fillRect(x+i,y+24,1,200);
    }

    ctx.fillStyle = "cyan";
    let min, max, value;
    for (let i=0; i<w; i++) {
        min= 9999; max= -9999;
        let numSamples_for_pixel = g_sampleRate*g_pixel_size / 1000;
        let area_start = i +scrollPosMsec ;      // g_numSmp_per_px
        // let area_end = (i+1)*numSamples_for_pixel; 
        for (j=0; j<numSamples_for_pixel; j++) {
            value = wavBuffer[ area_start +j ];
            if ( value >= max)
              max = value;      //parseInt(value);
            if ( value <= min)
              min = value;      //parseInt(value);
        }
        ctx.beginPath();
        ctx.moveTo( x+i+0.5, y+124+min );
        ctx.lineTo( x+i+0.5, y+124+max );
        ctx.stroke();
            // ctx.fillRect(x+i,y+24+min,1,(max-min));
    }    

    ctx.fillStyle = backup_fillStyle;
}

var make_msec_string = (millisec) => {
    let sec = parseInt(millisec)/1000;
    let m = parseInt(sec/60);
    sec = parseInt(sec%60);
    let milli = parseInt((millisec % 1000)/100);
    // console.log("millisec ="+millisec+", min="+m+", sec="+sec+", milli="+milli );
    let timeString = m+":"+sec.toString().padStart(2,'0')+"."+milli.toString().padStart(3,'0');      // "0:00.000"
    return timeString;
}

var new_zoom_in = () => {
    if (g_pixel_size > 2)
        g_pixel_size /= 2;

    if (g_pixel_size < 4)
        g_rulerGrid = 200;
    else if (g_pixel_size < 8)
        g_rulerGrid = 500;
    else if (g_pixel_size < 32)
        g_rulerGrid = 4000;
    else 
        g_rulerGrid = 8000;
    console.log(">> pixel_size="+g_pixel_size+", grid="+g_rulerGrid);
    draw_mp3Wav(0);
}

var new_zoom_out = () => {
    if (g_pixel_size < 32)
        g_pixel_size *= 2;

        if (g_pixel_size < 4)
        g_rulerGrid = 200;
    else if (g_pixel_size < 8)
        g_rulerGrid = 500;
    else if (g_pixel_size < 32)
        g_rulerGrid = 4000;
    else 
        g_rulerGrid = 8000;
    console.log(">> pixel_size="+g_pixel_size+", grid="+g_rulerGrid);
    draw_mp3Wav(0);
}

/*
var isWaveClicked;
var waveScroll_x = 0, prev_waveposition=0;

var waveform_mouseDown = (e) => {
    let canvas = document.getElementById("canvas_waveform");
    const rect = canvas.getBoundingClientRect();
    last_posX = e.clientX - rect.left;
    last_posY = e.clientY - rect.top;

    last_timeStamp = parseInt(document.getElementById("timeStamp_input").value);
    waveScroll_x = 0;
    prev_waveposition = scrollPosition;

    isWaveClicked = true;
    e.preventDefault();
};
var waveform_mouseMove = (e) => {
    if (isWaveClicked) {
        let canvas = document.getElementById("canvas_waveform");
        const rect = canvas.getBoundingClientRect();
        let cursor_x = e.clientX - rect.left;
        let cursor_y = e.clientY - rect.top;
    
        waveScroll_x = (cursor_x-last_posX)*g_numSmp_per_px;
        scrollPosition = prev_waveposition-waveScroll_x;
    }
    e.preventDefault();
          
};
var waveform_mouseUp = (e) => {
    last_posX = 0;
    last_posY = 0;
    last_timeStamp = 0;

    let canvas = document.getElementById("canvas_waveform");
    const rect = canvas.getBoundingClientRect();
    let cursor_x = e.clientX - rect.left;
    let temp_idx = (cursor_x-START_XPOS)*g_numSmp_per_px+scrollPosition;
    let clicked_ts = parseInt(temp_idx*1000/g_sampleRate+g_offset);

    scrollPosition = prev_waveposition-waveScroll_x;
    moving_note_idx = -1;
    isWaveClicked = false;
    e.preventDefault();
};

var waveform_wheelScroll = (e) => {
    console.log("mouse wheel changed - Zoom");
};
*/
