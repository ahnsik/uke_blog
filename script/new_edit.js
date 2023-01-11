/* ================================
    우쿨렐레 악보에 MP3 싱크 맞추는 프로그램.
================================ */

const song_list = [
  "60 BPM 4/4박자 드럼비트 (48000Hz)",
  "60 BPM 3/4박자 모노 드럼비트 (8000Hz)",
  "61 BPM 4/4박자 메트로놈 8비트 (8000Hz)",
  "62 BPM 4/4박자 심플락 그루브 (8000Hz)",
  "63 BPM 4/4박자 메트로놈 (8000Hz)",
  "63 BPM 4/4박자 펑키드럼 (48000Hz)",
  "80 BPM 4/4박자 드럼비트 (16000Hz)",
  "90 BPM 3/4박자 드럼비트 (8000Hz)",

  "하와이 연정 - 패티킴",
  "언제나 몇번이나 - 센과 치히로의 행방불명 OST",
  "때로는 옛 이야기를 - 붉은 돼지 OST",
  "세계의 약속 - 하울의 움직이는 성 OST",
  "비행기 구름 - 바람이 분다 OST", 
  "El Condor Pasa - 핑거스타일",
  "El Condor Pasa - 멜로디",
  "Kiss the Rain - 이루마",
  "코쿠리코 언덕에서 - 지브리OST",
  "인생의 회전목마 - 하울의 움직이는 성 OST",
  "비와 당신",
  "바다가 보이는 마을 - 마녀의 택급편",
  "Somewhere over the rainbow - IZ",
  "너에게 난 나에게 넌 - 자탄풍(자전거 탄 풍경)"
];
const file_list = [
  "http://ccash.gonetis.com:88/uke_blog/data/60BPM_Drum_Beat_3min_48000Hz.json", 
  "http://ccash.gonetis.com:88/uke_blog/data/60Bpm_3-4Beat_Drum_8bit_mono_8000hz.json", 
  "http://ccash.gonetis.com:88/uke_blog/data/61bpm_metronome_drum_8000hz_8bitMono.json", 
  "http://ccash.gonetis.com:88/uke_blog/data/62bpm_Simple_Rock_Drum_Groove_8000hz_8bitMono.json", 
  "http://ccash.gonetis.com:88/uke_blog/data/63 bpm metronome drum.json", 
  "http://ccash.gonetis.com:88/uke_blog/data/63-BPM-Funk-Drum-Loop-YouTube.json", 
  "http://ccash.gonetis.com:88/uke_blog/data/80BPM_Drum_Beat_3min_stereo16000hz.json", 
  "http://ccash.gonetis.com:88/uke_blog/data/90Bpm_3-4Beat_Drum_8bit_mono_8000hz.json",

  "http://ccash.gonetis.com:88/uke_blog/data/hawaiian_lovesong.json",
  "http://ccash.gonetis.com:88/uke_blog/data/itsumonandodemo.json",
  "http://ccash.gonetis.com:88/uke_blog/data/sometimes_telling_old_story.json",
  "http://ccash.gonetis.com:88/uke_blog/data/appointment_of_world.json",
  "http://ccash.gonetis.com:88/uke_blog/data/hikoki_gumo.json",
  "http://ccash.gonetis.com:88/uke_blog/data/elcondorpasa_fingerstyle.json",
  "http://ccash.gonetis.com:88/uke_blog/data/elcondorpasa_melody.json",
  "http://ccash.gonetis.com:88/uke_blog/data/kiss_the_rain_new.json",
  "http://ccash.gonetis.com:88/uke_blog/data/kokuriko-ghibri.json",
  "http://ccash.gonetis.com:88/uke_blog/data/merry_go_round_in_Life.json",
  "http://ccash.gonetis.com:88/uke_blog/data/rain_and_you.json",
  "http://ccash.gonetis.com:88/uke_blog/data/umigamierumachi.json",
  "http://ccash.gonetis.com:88/uke_blog/data/SomewhereOvertheRainbow.json",
  "http://ccash.gonetis.com:88/uke_blog/data/me_toyou_you_tome.json"
];


const CHORD_ICON_Y = 48;
const STROKE_ICON_Y = 136;
const TAB_LINE_A_Y = 80;
const TAB_LINE_E_Y = 96;
const TAB_LINE_C_Y = 112;
const TAB_LINE_G_Y = 128;
const LYRIC_TEXT_Y = 164;
const START_XPOS = 60;
const CANVAS_FONT_BIGGER = '32px SeoulNamsan canvas';
const CANVAS_FONT_BIG = '26px SeoulNamsan canvas';
const CANVAS_FONT_BASIC = '20px SeoulNamsan canvas';
const CANVAS_FONT_SMALL = '16px SeoulNamsan canvas';
const CANVAS_FONT_SMALLER = '12px SeoulNamsan canvas';
const CANVAS_FONT_TINY = '9px SeoulNamsan canvas';

const WAVEFORM_COLOR_PAST = "darkgray";
const WAVEFORM_COLOR_ODD = "blue";
const WAVEFORM_COLOR_EVEN = "green";
const QUAVER_GRID_COLOR = "#BBC";
const QUAVER_BG_COLOR = "#CCD";
const QUAVER_FIRST_COLOR = "#BBC";
const LYRIC_BG_COLOR = "#FDD";
const LYRIC_FIRST_COLOR = "#ECC";

const H_WAVEFORM = 200;
const H_TECHNIC = 48;
const H_NOTES = 96;
const H_CHORD = 26;
const H_LIRIC = 26;
const H_RULER = 12;
const H_OFFSET_SLIDER = 10;
const H_TOTAL = (H_OFFSET_SLIDER+H_RULER+H_WAVEFORM+H_TECHNIC+H_NOTES+H_CHORD+H_LIRIC+H_RULER);

var note_icon;          // 운지 위치 (flet)을 표시하는 숫자들 - 비트맵, 스프라이트
var chord_icon;         // 코드 테이블을 모아 둔 비트맵

var canvas_width = 0, canvas_height = 0;

var song_data = null;   // 우쿨렐레 TAB 악보를 불러 올 JSON 객체. 
var audioTag;           // song play & stop, etc..

var scrollPosition = 0; // to drawing waveform start draw
var array_l = [];       // WAVEFORM data - float32 로 되어 있음.

/* ================================
    HTML 로드 되고 초기화 동작. - resource load, etc..
================================ */
window.onload = function main() {
  ////  비트맵 리소스 로드.  bitmap resources ready.
  note_icon = document.getElementById("uke_note");
  chord_icon = document.getElementById("whole_chords");

  //// URL로 부터 parameter 를 읽어 와서 곡을 선택할 수 있게 함. - 현재는 play 파라메터 뿐.
  let initialSelect = getParameterByName("initial_idx");
  if ( !initialSelect ) {
    initialSelect = 0;
  }
  console.log("request initial Song file index:" + initialSelect );

  ////  악보 데이터를 고를 수 있도록 selector 준비.
  selector = document.getElementById("song_list");
  if (initialSelect >= song_list.length)    // index overflow 방지.
    initialSelect = 0;
  for (var i=0; i<song_list.length; i++) {
    var item = document.createElement("option");
    item.text = song_list[i];
    item.value = file_list[i];
    if (i == initialSelect) 
      item.selected="selected";
    selector.appendChild(item);
  }
  selector.onchange = function() {
    console.log("Song file - Changed : " + file_list[selector.selectedIndex] );
    scrollPosition = 0;
    xmlhttp.open("GET", file_list[selector.selectedIndex], true);
    xmlhttp.send();
  }

  ////  loading *.uke JSON data
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      song_data = JSON.parse(this.responseText);
      let title = document.getElementById("song_title");
      title.innerHTML = song_data.title;
      let comments = document.getElementById("comments");
      comments.innerHTML = song_data.comment;
      let dom_bpm = document.getElementById("bpm");
      dom_bpm.value = parseFloat(song_data.bpm);
      console.log("[][] BPM value set:" + dom_bpm.value + " (from:" + song_data.bpm + ")"  );
      let dom_offset = document.getElementById("offset");
      dom_offset.value = parseInt(song_data.start_offset);
      
      scrollPosition = 0;
      // 앨범thumbnail 파일 표시 .
      changeThumnail(song_data.thumbnail);
      console.log("썸네일:" + thumbnail.src  );
      // MP# 파일 로딩.
      audioTag = document.getElementById("playing_audio");
      if (song_data.source.length > 0) {
        console.log("음원파일:" + song_data.source + "("+song_data.source.length+")"+", loaded="+array_l.length );
        request_mp3(song_data.source);
        document.getElementById("loadMP3_file").innerHTML = song_data.source;
      } else {
        console.error("clear array_l. loaded="+array_l.length );
        array_l = [];
      }
      change_speed(1.0);
      //  Drawing Tabulature
      resize_canvas( window.innerWidth-40);
    }
  };
  xmlhttp.open("GET", file_list[initialSelect], true);
  xmlhttp.send();
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

window.addEventListener("resize", window_resized);
function window_resized(event) {
  resize_canvas (event.target.innerWidth-40 );
}

///////////////////////////////////////////////////////////////
//// 본격적인 Drawing 함수들의 시작.
///////////////////////////////////////////////////////////////

function resize_canvas(cnvs_width) {
  canvas_width = cnvs_width;
  canvas_height = 500;
  let edit_area = document.getElementById("edit_area");
  edit_area.width = cnvs_width;     // event.target.innerWidth-30;
  edit_area.height = canvas_height;
  edit_area.onmousedown = edit_mouseDown;
  edit_area.onmousemove = edit_mouseMove;
  edit_area.onmouseup = edit_mouseUp;
  // draw_tabulature();
  draw_editor();
}

/*
var chord_name_table = [
  "C",   "Cm",   "C7",  "Cmaj7",  "Cm7",  "Cdim",  "Cm7b5",  "Caug",  "Csus4",  "C6",  "C9",  "Cmaj9",  "Cmmaj7",  "Cadd9",
  "C#",  "C#m",  "C#7", "C#maj7", "C#m7", "C#dim", "C#m7b5", "C#aug", "C#sus4", "C#6", "C#9", "C#maj9", "C#mmaj7", "C#add9",
  "D",   "Dm",   "D7",  "Dmaj7",  "Dm7",  "Ddim",  "Dm7b5",  "Daug",  "Dsus4",  "D6",  "D9",  "Dmaj9",  "Dmmaj7",  "Dadd9",
  "D#",  "D#m",  "D#7", "D#maj7", "D#m7", "D#dim", "D#m7b5", "D#aug", "D#sus4", "D#6", "D#9", "D#maj9", "D#mmaj7", "D#add9",
  "E",   "Em",   "E7",  "Emaj7",  "Em7",  "Edim",  "Em7b5",  "Eaug",  "Esus4",  "E6",  "E9",  "Emaj9",  "Emmaj7",  "Eadd9",
  "F",   "Fm",   "F7",  "Fmaj7",  "Fm7",  "Fdim",  "Fm7b5",  "Faug",  "Fsus4",  "F6",  "F9",  "Fmaj9",  "Fmmaj7",  "Fadd9",
  "F#",  "F#m",  "F#7", "F#maj7", "F#m7", "F#dim", "F#m7b5", "F#aug", "F#sus4", "F#6", "F#9", "F#maj9", "F#mmaj7", "F#add9",
  "G",   "Gm",   "G7",  "Gmaj7",  "Gm7",  "Gdim",  "Gm7b5",  "Gaug",  "Gsus4",  "G6",  "G9",  "Gmaj9",  "Gmmaj7",  "Gadd9",
  "G#",  "G#m",  "G#7", "G#maj7", "G#m7", "G#dim", "G#m7b5", "G#aug", "G#sus4", "G#6", "G#9", "G#maj9", "G#mmaj7", "G#add9",
  "A",   "Am",   "A7",  "Amaj7",  "Am7",  "Adim",  "Am7b5",  "Aaug",  "Asus4",  "A6",  "A9",  "Amaj9",  "Ammaj7",  "Aadd9",
  "A#",  "A#m",  "A#7", "A#maj7", "A#m7", "A#dim", "A#m7b5", "A#aug", "A#sus4", "A#6", "A#9", "A#maj9", "A#mmaj7", "A#add9",
  "B",   "Bm",   "B7",  "Bmaj7",  "Bm7",  "Bdim",  "Bm7b5",  "Baug",  "Bsus4",  "B6",  "B9",  "Bmaj9",  "Bmmaj7",  "Badd9",
];

////  TAB 악보의 바탕 (4줄) 그리기.
var draw_tab_lines = function(ctx, ypos) {
  ctx.lineWidth = "2px";
  ctx.fillStyle = "black";
  ctx.moveTo(10,ypos+TAB_LINE_A_Y);    ctx.lineTo(canvas_width-20, ypos+TAB_LINE_A_Y);
  ctx.moveTo(10,ypos+TAB_LINE_E_Y);    ctx.lineTo(canvas_width-20, ypos+TAB_LINE_E_Y);
  ctx.moveTo(10,ypos+TAB_LINE_C_Y);    ctx.lineTo(canvas_width-20, ypos+TAB_LINE_C_Y);
  ctx.moveTo(10,ypos+TAB_LINE_G_Y);    ctx.lineTo(canvas_width-20, ypos+TAB_LINE_G_Y);
  ctx.stroke();
  ctx.font = CANVAS_FONT_BASIC;    // font 설정 - 주로 가사 표시할 때 사용될 폰트.
  // 'TAB' 표시 
  ctx.drawImage(note_icon, 19*18, 0, 28, 63,   10, TAB_LINE_A_Y-8, 28, 63);     // src_x, y, w, h ,  dst x, y, w, h
}

////   JSON데이터(배열)로 악표 표시
var draw_notes = function(ctx, data, start_idx) {
  var xpos;
  var count = 0;
  for (var i=start_idx; i<data.length; i++) {
    xpos = START_XPOS + ((data[i].timestamp)/480) *note_space;           //// 악보 내에 note 간의 간격 = 480,
    if (xpos >= canvas_width) {
      break;
    }
    draw_a_note(ctx, data[i], xpos );
    count+=1;
  }
  return count;
}

////   1개의 화음을 표시
var draw_a_note = function(ctx, data, xpos) {
  var g, c, e, a;             // 플랫 정보
  var f_g, f_c, f_e, f_a;     // finger 정보 
  var c_g, c_c, c_e, c_a;     // 숫자의 색상 (y좌표) 컬러 값 (1=검지=green, 2=중지=Magenta, 3=약지=CYAN, 4=새끼=짙은파랑)

  data.tab.forEach(element => {
    switch(element.substr(0,1) ) {
      case "G":
        f_g = element.substr(-1);
        g = ( f_g >= 'a' ) ? element.substr(1,element.length-2) : element.substr(1);
        c_g = (f_g=='i')? 46 : (f_g=='m')? 31 : (f_g=='a')? 16 : (f_g=='c')? 61 : 1 ;
        break;
      case "C":
        f_c = element.substr(-1);
        c = ( f_c >= 'a' ) ? element.substr(1,element.length-2) : element.substr(1);
        c_c = (f_c=='i')? 46 : (f_c=='m')? 31 : (f_c=='a')? 16 : (f_c=='c')? 61 : 1 ; 
        break;
      case "E":
        f_e = element.substr(-1);
        e = ( f_e >= 'a' ) ? element.substr(1,element.length-2) : element.substr(1);
        c_e = (f_e=='i')? 46 : (f_e=='m')? 31 : (f_e=='a')? 16 : (f_e=='c')? 61 : 1 ; 
        break;
      case "A":
        f_a = element.substr(-1);
        a = ( f_a >= 'a' ) ? element.substr(1,element.length-2) : element.substr(1);
        c_a = (f_a=='i')? 46 : (f_a=='m')? 31 : (f_a=='a')? 16 : (f_a=='c')? 61 : 1 ; 
        break;
    }
  });

  // 마디 구분 표시
  if (data.technic) {
    if (data.technic.indexOf('|') >= 0) {   // 마디 표시
      ctx.fillRect(xpos-2, TAB_LINE_A_Y, 1, (TAB_LINE_G_Y-TAB_LINE_A_Y) );
    }
    // if ( data.technic.indexOf('3') >= 0 ) {     // 셋 잇단음표를 표시
    //   ctx.drawImage(note_icon, 339, 92, 14,8,  xpos+8, STROKE_ICON_Y+8,  14,8);
    // }
  }

  // 코드 표시 (아이콘)
  if (data.chord) {         // 코드를 표시
    var chord_index = chord_name_table.indexOf(data.chord);
    // console.log("chord: ["+data.chord+"] ==> index: " + chord_index );
    ctx.drawImage(chord_icon, (chord_index%14)*50, parseInt(chord_index/14)*54, 49,53,  xpos, 10,  49, 53);
  }
  // 스트로크 방향 및 Hammering-On, Pulling-Off, Slide 등을 표시 
  if (data.stroke) {         // 스트로크를 표시
    // console.log("stroke: " + data.stroke );
    if ( data.stroke.indexOf('D') >= 0 ) {
      ctx.drawImage(note_icon, 339, 64, 14,26,  xpos, STROKE_ICON_Y,  14,26);
    } else if ( data.stroke.indexOf('U') >= 0 ) {
      ctx.drawImage(note_icon, 354, 64, 14,26,  xpos, STROKE_ICON_Y,  14,26);
    } 
    if ( data.stroke.indexOf('H') >= 0 ) {
      ctx.drawImage(note_icon, 369, 65, 11,15,  xpos+16, STROKE_ICON_Y,  11,15);
    } else if ( data.stroke.indexOf('P') >= 0 ) {
      ctx.drawImage(note_icon, 382, 65, 11,15,  xpos+16, STROKE_ICON_Y,  11,15);
    } else if (data.stroke.indexOf('s') >= 0 ) {    // 슬라이드를 표시
      ctx.drawImage(note_icon, 339, 92, 14,8,  xpos+8, STROKE_ICON_Y+8,  14,8);
    }
    if ( data.stroke.indexOf('~') >= 0 ) {
      ctx.drawImage(note_icon, 369, 0, 9, 63,  xpos+14, STROKE_ICON_Y-64,  9,63);
    }
  }
  // 화음 및 음표에 따른 연주 플랫 정보를 표시. 
  if (g != undefined ) {
    ctx.drawImage(note_icon, g*18, c_g, 15, 12,   xpos, TAB_LINE_G_Y-8, 16, 14);     // src_x, y, w, h ,  dst x, y, w, h
  }
  if (c != undefined ) {
    ctx.drawImage(note_icon, c*18, c_c, 15, 12,   xpos, TAB_LINE_C_Y-8, 16, 14);     // src_x, y, w, h ,  dst x, y, w, h
  }
  if (e != undefined ) {
    ctx.drawImage(note_icon, e*18, c_e, 15, 12,   xpos, TAB_LINE_E_Y-8, 16, 14);     // src_x, y, w, h ,  dst x, y, w, h
  }
  if (a != undefined ) {
    ctx.drawImage(note_icon, a*18, c_a, 15, 12,   xpos, TAB_LINE_A_Y-8, 16, 14);     // src_x, y, w, h ,  dst x, y, w, h
  }
  // 가사를 표시
  if (data.lyric) {
    ctx.fillText( data.lyric, xpos, LYRIC_TEXT_Y );
  }

}

*/

var g_sampleRate = 0;        // 1초당 sound sample 수.. --> 이 값에 따라 grid 의 pixel 간격이 달라질 수 있으므로 주의.
var g_totalMsec = 0;         // 음악 전체의 길이 (msec단위)

var signature_divider = 8;   // 마디 당 quaver 수, default 는 4/4 박자, 8분음표
var g_edit_size = 8;         // 8=quaver(8분음표), 16=semi-quaver(16분음표)
var g_bpm = 60;
var g_offset = 0;
var g_numSmp_per_px = 256;     // number of samples per pixel;        --> 1, 2, 4, 8, 16, 32, 64, 128, .. <-- 확대/축소 배율

var g_numSmp_per_quaver = (g_sampleRate*30) / g_bpm;      // 기준 음표(8분음표or16분음표)가 차지하는 가로 pixel 크기    // var grid_width = 20;        // 1개 단위음 (8분음표 or 16분음표) 크기 - BPM 및 확대/축소에 따라, 박자(signature)에 따라 크기가 변경된다.


//// MP3 데이터를 로딩 하여 디코딩 요청.
function request_mp3(filename) {
  stop_song();
  if (filename) {       //  loading *.MP3 data :   refer : https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
    array_l = [];
    audioTag.src = "http://ccash.gonetis.com:88/uke_blog/data/"+filename;
    if (!filename || filename.length == 0) {
      console.log("음원파일을 지정하지 않았습니다..");
      return;
    } else {
      console.log("음원파일 = " + filename);
    }
    var oReq = new XMLHttpRequest();
    oReq.open("GET", "http://ccash.gonetis.com:88/uke_blog/data/"+filename, true);
    oReq.responseType = "arraybuffer";
    oReq.onload = function() {
      console.log("xmlhttpReq... sftp://ccash.gonetis.com:/home/ahnsik/ukulele/"+filename);
      if (this.readyState != 4 || this.status != 200) {
        console.log("... readyState=" + this.readyState + ", status="+this.status );
        return;
      }
      let mp3Buffer = oReq.response; // Note: not oReq.responseText
      console.log("start decode MP3");
      mp3Decode(mp3Buffer);         // 디코딩 된 mp3 데이터는 0번채널을 array_l 라는 버퍼에 float32 데이터로 저장해 담아 둔다.
      if (array_l && array_l.length > 0) {
        console.log("[][] starting MP3 draw...");
      } else {
        console.log("[][] MP3 decode fail or length==" + (array_l)?array_l.length:"null" );
      }
    };
    oReq.send(null);
    console.log("--> request_end:" + filename );
  }
}

//// MP3 데이터를 디코딩 하여 array_l 버퍼에 저장.
async function mp3Decode(mp3Buffer) {
  const ac = new AudioContext();
  const audioBuf =  await ac.decodeAudioData(mp3Buffer);
  console.log("[][] ac.decodeAudioData:"+audioBuf.length+" bytes, channels="+audioBuf.numberOfChannels+", sampleRate="+audioBuf.sampleRate );    // refer AudioBuffer: https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
  g_sampleRate = audioBuf.sampleRate;
  g_totalMsec = audioBuf.duration;
  let float32Array_l = audioBuf.getChannelData(0);
  let i=0;
  let wavefrom_size = parseInt( (H_WAVEFORM-1)/2 );
  const length = float32Array_l.length;
  array_l = [];
  while(i<length) {
    array_l.push( float32Array_l[i] * wavefrom_size );
    // array_r.push( float32Array_r.slice(i, i+chunkSize).reduce(function(total,value) {
    //   return Math.max(total, Math.abs(value));
    // }));
    i++;
  }  


  draw_editor();
}

///////////////////////////////////////////////////////////////
//// 편집화면영역(waveform, TAB, etc..)을 Drawing
///////////////////////////////////////////////////////////////
var draw_editor = () => {
  let canvas=document.getElementById("edit_area");
  canvas.width = canvas_width;
  canvas.height = canvas_height;
  let ctx = canvas.getContext("2d");
  ctx.textBaseline = 'top';
  ctx.font = CANVAS_FONT_BASIC;   //'36px SeoulNamsan canvas';
  ctx.fillStyle = 'white';
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  ctx.fillStyle = 'black';
  ctx.imageSmoothingEnabled= true;

  calc_note_size();

  draw_offset_slider(ctx, 0);   // 옵셋 조정 막대
  draw_ruler(ctx, H_OFFSET_SLIDER);   // 상단 : 줄자
  draw_ruler(ctx, canvas_height-H_RULER);   // 하단 : 줄자

  draw_waveform(ctx, H_OFFSET_SLIDER+H_RULER, H_WAVEFORM);
  draw_tab_notes(ctx, H_OFFSET_SLIDER+H_RULER+H_WAVEFORM);

  // draw_tab_lines(ctx);    // 바탕이 되는 4선(TAB line)을 그린다.
  ctx.font = CANVAS_FONT_BIGGER; //'26px SeoulNamsan canvas';
  ctx.fillText("글꼴 확인용 그리기 테스트. Font Check for canvas drawing..", 120, 90, 820);
  ctx.font = CANVAS_FONT_SMALLER; //'26px SeoulNamsan canvas';
  ctx.fillText("글꼴 확인용 그리기 테스트. Font Check for canvas drawing..", 120, 140, 820);
}

var draw_offset_slider = (ctx, ypos) => {
  let color_backup = ctx.fillStyle;
  let font_backup = ctx.font;

  ctx.fillStyle = '#CCC';
  ctx.fillRect(START_XPOS, ypos, canvas_width, 2);
  ctx.fillStyle = '#DDD';
  ctx.fillRect(START_XPOS, ypos+2, canvas_width, 6);
  ctx.fillStyle = '#CCC';
  ctx.fillRect(START_XPOS, ypos+8, canvas_width, 4);
  ctx.fillStyle = '#888';
  ctx.font = CANVAS_FONT_TINY;
  ctx.fillText("offset_slider:", 0, 0, START_XPOS);

  // // 커서 위치가 편집영역 안에 들어오게 되면 스크롤 가능 표시를 해 준다.
  // if ( (cursor_ypos>ypos)&&(cursor_ypos<ypos+12) ) {
  //   ctx.font = CANVAS_FONT_SMALLER; //'26px SeoulNamsan canvas';
  //   ctx.fillText("◀ ▶", cursor_xpos, ypos, 8);
  // }
  ctx.font = font_backup;
  ctx.fillStyle = color_backup;
}

var draw_ruler = (ctx, ypos) => {
  let color_backup = ctx.fillStyle;
  let font_backup = ctx.font;
  ctx.fillStyle = '#888';
  ctx.font = CANVAS_FONT_TINY;

  let grid_time;
  let time_string;
  for (var i=0; i<(canvas_width-START_XPOS); i++)  {
    if ( parseInt((i*g_numSmp_per_px)/g_sampleRate) != parseInt(((i+1)*g_numSmp_per_px)/g_sampleRate) ) {
      ctx.fillRect(START_XPOS+i, ypos+2, 1, 10);
      grid_time = parseInt(i*g_numSmp_per_px)+parseInt(scrollPosition) / parseInt(g_sampleRate);
      time_string = ""+Math.trunc(grid_time/60000)+":"+Math.trunc((grid_time%60000)/1000)+"."+Math.trunc(grid_time%1000);
      // console.log("grid_time="+grid_time+".toString="+time_string );
      ctx.fillText(time_string, START_XPOS+i+2, ypos);  // "0:00.000"
    } else {
      ctx.fillRect(START_XPOS+i, ypos+6, 1, 6);
    }
  }
  ctx.fillText("playing time:", 0, ypos, START_XPOS);
  ctx.font = font_backup;
  ctx.fillStyle = color_backup;
}

//// 디코딩 된 MP3 (waveform) 데이터를 캔버스에 Draw 한다. 
var draw_waveform = (ctx, ypos, height) => {
  let color_backup = ctx.fillStyle;
  let font_backup = ctx.font;
  ctx.fillStyle = '#888';
  ctx.font = CANVAS_FONT_TINY;

  if (array_l && array_l.length>0) {    // MP3 디코딩 된 데이터가 있으면 그린다. 없으면 안그림.
    waveformDraw(ctx, ypos, array_l);
  }
  ctx.font = font_backup;
  ctx.fillStyle = color_backup;
};

var waveformDraw = (ctx, ypos, wavBuffer) => {
  let i, j, min, max, temp_offset, value;
  let wavefrom_size = parseInt( (H_WAVEFORM-1)/2 );
  let waveform_offset = g_offset * g_sampleRate/1000;

  let current_playing_index = audioTag.currentTime*g_sampleRate;

  for ( i = 0; i< (canvas_width-START_XPOS); i++ ) {

    min= wavefrom_size; max= -wavefrom_size;
    temp_offset = (i*g_numSmp_per_px)+scrollPosition;
    if ( (typeof(temp_offset)!="number") || 
          (typeof(scrollPosition)!="number") ||
          (typeof(waveform_offset) != "number") ) {
      console.error ( "typeof temp_offset="+typeof(temp_offset)+ ", typeof scrollPosition="+typeof(scrollPosition)+ ",typeof g_offset="+typeof(waveform_offset) );
    }
    for ( j=0; j<g_numSmp_per_px; j++) {
      value = wavBuffer[temp_offset +waveform_offset +j ];
      if ( value >= max)
        max = value;      //parseInt(value);
      if ( value <= min)
        min = value;      //parseInt(value);
    }

    if ( (temp_offset % g_numSmp_per_quaver) < g_numSmp_per_px ) {    // 기준음표 1개 길이마다 grid 눈금으로 표시.    // if ( (parseInt(temp_offset) % parseInt(g_numSmp_per_quaver)) < g_numSmp_per_px ) {    // 기준음표 1개 길이마다 grid 눈금으로 표시.
      // console.log("quaver check: i="+i+", offset="+temp_offset + ", quaver_smp="+parseInt(g_numSmp_per_quaver/g_numSmp_per_px) + ", g_numSmp_per_px=" + parseInt(g_numSmp_per_px) );
      ctx.fillStyle = QUAVER_GRID_COLOR;
    } else if ( (parseInt(temp_offset / g_numSmp_per_quaver) % signature_divider ) === 0 ) { // 각 마디별로 첫번째 마디인 경우에 배경색 변경.
      ctx.fillStyle = QUAVER_FIRST_COLOR;
    } else {
      ctx.fillStyle = QUAVER_BG_COLOR;
    }
    ctx.fillRect(START_XPOS+i+0.5, ypos, 1, H_WAVEFORM );

    if ( (temp_offset+waveform_offset) < current_playing_index ) { 
      ctx.strokeStyle = WAVEFORM_COLOR_PAST;
    } else {
      if ( ( parseInt(temp_offset/g_sampleRate) % 2) == 0 ) {   // 초단위 구분을 위한 색깔 변화
        ctx.strokeStyle = WAVEFORM_COLOR_EVEN;
      } else {
        ctx.strokeStyle = WAVEFORM_COLOR_ODD;
      }
    }
    ctx.beginPath();
    ctx.moveTo( START_XPOS+ i+0.5, ypos+100 + min );
    ctx.lineTo( START_XPOS+ i+0.5, ypos+100 + max );
    ctx.stroke();
  }
}


var draw_tab_notes = (ctx, ypos) => {
  let i, j, temp_offset;

  for ( i = 0; i< (canvas_width-START_XPOS); i++ ) {
    temp_offset = parseInt(i*g_numSmp_per_px)+parseInt(scrollPosition)+parseInt(g_offset);

    if ( (parseInt(temp_offset) % parseInt(g_numSmp_per_quaver)) < g_numSmp_per_px ) {
      // grid 눈금
      ctx.fillStyle = QUAVER_GRID_COLOR;
      ctx.fillRect(START_XPOS+i, ypos, 1, (H_TECHNIC+H_NOTES+H_CHORD+H_LIRIC) );
    } else if ( (parseInt(temp_offset / g_numSmp_per_quaver) % signature_divider ) === 0 ) {
      // // lyric - highlight
      // ctx.fillStyle = '#ECC';
      // ctx.fillRect(START_XPOS+i, ypos, 1, H_LIRIC);
      // // chord - highlight
      // ctx.fillStyle = '#EEC';
      // ctx.fillRect(START_XPOS+i, ypos+H_LIRIC, 1, H_CHORD);
      // // tab notes - highlight
      // ctx.fillStyle = '#CCC';
      // ctx.fillRect(START_XPOS+i, ypos+H_LIRIC+H_CHORD, 1, H_NOTES);
      // // techinics - highlight
      // ctx.fillStyle = '#CEC';
      // ctx.fillRect(START_XPOS+i, ypos+H_LIRIC+H_CHORD+H_NOTES, 1, H_TECHNIC);
      ctx.fillStyle = '#CEC';
      ctx.fillRect(START_XPOS+i, ypos, 1, H_TECHNIC+H_LIRIC+H_CHORD+H_NOTES);
    } else {
      // // lyric
      // ctx.fillStyle = '#FDD';
      // ctx.fillRect(START_XPOS+i, ypos, 1, H_LIRIC);
      // // chord
      // ctx.fillStyle = '#FFD';
      // ctx.fillRect(START_XPOS+i, ypos+H_LIRIC, 1, H_CHORD);
      // // tab notes
      // ctx.fillStyle = '#DDD';
      // ctx.fillRect(START_XPOS+i, ypos+H_LIRIC+H_CHORD, 1, H_NOTES);
      // // techinics
      // ctx.fillStyle = '#DFD';
      // ctx.fillRect(START_XPOS+i, ypos+H_LIRIC+H_CHORD+H_NOTES, 1, H_TECHNIC);
      ctx.fillStyle = '#DFD';
      ctx.fillRect(START_XPOS+i, ypos, 1, H_TECHNIC+H_LIRIC+H_CHORD+H_NOTES);
    }
  }
}



var play_handler = null;
var speed_multiplier = 1.0;

var play_song = () => {
  if (play_handler==null) {
    audioTag.play();
    document.getElementById("play_song").src = "common/pause.svg" ;
    play_handler = setInterval( function() {
      draw_editor();
      if (audioTag.ended) {
        stop_song();
      }
    }, 50);
  } else {
    audioTag.pause();
    document.getElementById("play_song").src = "common/play.svg" ;
    clearInterval(play_handler);
    play_handler = null;
    draw_editor();
  }
};

var stop_song = () => {
  audioTag.pause();
  audioTag.currentTime = 0;
  document.getElementById("play_song").src = "common/play.svg" ;
  clearInterval(play_handler);
  play_handler = null;
  console.log("Stopped. - Clear Interval. :" + play_handler);
  draw_editor();
}

var change_speed = (speed) => {
  console.log("change speed multiply:" + speed);
  speed_multiplier = speed;

  let btn_0_5 = document.getElementById("speed_0_5");  btn_0_5.src = "common/_slow0.5.svg";
  let btn_0_75 = document.getElementById("speed_0_75");  btn_0_75.src = "common/_slow0.75.svg";
  let btn_1_0 = document.getElementById("speed_1_0");  btn_1_0.src = "common/_ff1.0.svg";
  let btn_1_25 = document.getElementById("speed_1_25");  btn_1_25.src = "common/_ff1.25.svg";
  let btn_1_5 = document.getElementById("speed_1_5");  btn_1_5.src = "common/_ff1.5.svg";
  let btn_2_0 = document.getElementById("speed_2_0");  btn_2_0.src = "common/_ff2.0.svg";
  switch(speed) {
    case 0.5:
      btn_0_5.src = "common/slow0.5.svg";      break;
    case 0.75:
      btn_0_75.src = "common/slow0.75.svg";      break;
    case 1.0:
      btn_1_0.src = "common/ff1.0.svg";      break;
    case 1.25:
      btn_1_25.src = "common/ff1.25.svg";      break;
    case 1.5:
      btn_1_5.src = "common/ff1.5.svg";      break;
    case 2.0:
      btn_2_0.src = "common/ff2.0.svg";      break;
  }
  audioTag.playbackRate = speed_multiplier;
}

var zoom_in = function () {
  if (g_numSmp_per_px > 2) {
    g_numSmp_per_px = g_numSmp_per_px/2;
    let dom_offset = document.getElementById("offset");
    dom_offset.step = parseInt(g_numSmp_per_px*1000/g_sampleRate);
    draw_editor();
  }
  console.log("g_numSmp_per_px :" + g_numSmp_per_px);
}

var zoom_out = function () {
  if (g_numSmp_per_px < 2048 ) {
    g_numSmp_per_px = g_numSmp_per_px*2;
    let dom_offset = document.getElementById("offset");
    dom_offset.step = parseInt(g_numSmp_per_px*1000/g_sampleRate);
    draw_editor();
  }
  console.log("g_numSmp_per_px :" + g_numSmp_per_px);
}

/*  BPM, 
  - 기준: 60 bpm, 4/4박자 를 가정했을 때,  1초당 sample 수는 sampleRate 이므로, 
    --> 8분음표(note) 단위하나(=numSmp_quaver)의 크기는..  sample_rate / 2 만큼의 sample갯수이어야 한다. (1초=8분음표2개)
    --> numSmp_quaver = g_sampleRate/2  가 된다.
    --> 그럼, qauver 당 pixel 수는 numSmp_quaver / g_numSmp_per_px  가 된다. 
       ==> g_numPx_per_quaver = (g_sampleRate/2) / g_numSmp_per_px

  // 초당8분음표샘플수 = g_sampleRate / 2;   // 60bpm일때
  // 초당8분음표샘플수 = (g_sampleRate/2) * bpm / 60;   // 80bpm일때
  // 1초너비 = (g_sampleRate/g_numSmp_per_px) 개의 픽셀.
  // 8분음표1개의픽셀 = 1초너비/초당8분음표샘플수 = (g_sampleRate/g_numSmp_per_px) / ((g_sampleRate/2) * bpm / 60) ; 
  //           ==>  (bpm * 초당8분음표갯수) / g_numSmp_per_px;
  // g_numPx_per_quaver = (g_sampleRate/2) / g_numSmp_per_px ;
  // console.log("[][] check: g_numSmp_per_px="+g_numSmp_per_px+", g_numPx_per_quaver="+g_numPx_per_quaver);
*/

var calc_note_size = () => {   // BPM, 편집단위, 박자 값으로 grid 크기를 결정.
  g_bpm = document.getElementById("bpm").value;
  g_edit_size = (document.getElementById("quaver_mode").selectedIndex == 0)?8:16;    // 8음표2개 or 16분음표4개
  g_numSmp_per_quaver = (g_sampleRate*(30*8/g_edit_size) ) / g_bpm;

  let _sign = document.getElementById("signature").value;

  switch(_sign) {       // 1마디에 들어갈 음표 갯수
    case "2/4":
      signature_divider = g_edit_size / 2;   // (8분음표는 4개, 16분 음표는 8개)
      break;
    case "3/4":
      signature_divider = g_edit_size*3 / 4;   // (8분음표는 6개, 16분 음표는 12개)
      break;
    case "6/8":
      signature_divider = g_edit_size*6 / 8;   // (8분음표는 6개, 16분 음표는 12개)
      break;
    case "4/4":
      signature_divider = g_edit_size;         // (8분음표는 8개, 16분 음표는 16개)
      break;
    default:
      signature_divider = parseInt( g_edit_size * _sign.split('/')[0] / _sign.split('/')[1] );
      console.log("_sign="+_sign+ ", split[0]="+parseInt(_sign.split('/')[0])+ ", divider=" + signature_divider );
      break;
  }
}

var quaver_changed = () => {
  calc_note_size();
  draw_editor();
}

var bpm_changed = () => {
  g_bpm = document.getElementById("bpm").value;
  console.log("BPM:" + g_bpm);
  calc_note_size();
  draw_editor();
}

var offset_changed = () => {
  g_offset = parseInt(document.getElementById("offset").value);
  console.log("playing offset:" + g_offset+", scrollPosition="+scrollPosition);
  calc_note_size();
  draw_editor();
}

var signature_changed = () => {
  let value = document.getElementById("signature").value;
  console.log("Signature:" + value);
  calc_note_size();
  draw_editor();
}


var last_posX=0, last_posY=0;
var scroll_x = 0, prev_position=0;
var isClicked = false;
var edit_mouseDown = (e) => {
  last_posX = e.clientX;
  last_posY = e.clientY;
  scroll_x = 0;
  prev_position = scrollPosition;
  isClicked = true;
  e.preventDefault();
}
var edit_mouseMove = (e) => {
  if (isClicked) {
    scroll_x = (last_posX - e.clientX)*g_numSmp_per_px;
    scrollPosition = prev_position+scroll_x;
  }
  e.preventDefault();
  draw_editor();
}
var edit_mouseUp = (e) => {
  last_posX = 0;
  last_posY = 0;
  scrollPosition = prev_position+scroll_x;
  isClicked = false;
  e.preventDefault();
  draw_editor();
}


var changeThumnail = (imgsrc) => {    /* when ThumbNail file upload succed. */
  let imgTag = document.getElementById("thumbnail");
  imgTag.src = "http://ccash.gonetis.com:88/uke_blog/data/"+ imgsrc;
  document.getElementById("loadThumbnail_file").innerHTML = imgsrc;
}
/*
async function ThumbUploadFile() {
  var uploadfiles = document.getElementById("loadThumbnail");

  let formData = new FormData();
  formData.append("file", uploadfiles.files[0]);
  await fetch('/uke_blog/upload.php', {
    method: "POST", 
    body: formData
  });
  alert('The file has been uploaded successfully.');
}

async function uploadFile() {
  var uploadfiles = document.getElementById("loadMP3");

  let formData = new FormData();
  formData.append("file", uploadfiles.files[0]);
  await fetch('/uke_blog/upload.php', {
    method: "POST", 
    body: formData
  });
  alert('The file has been uploaded successfully.');
}
*/
