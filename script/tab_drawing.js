var canvas_width = 0, canvas_height = 0;
var drawing_start = 0;      // 캔버스에 그려질 TAB 악보의 시작점. - 각 마디/라인 마다 캔버스를 분리해서 그릴 경우.

var draw_start_x = 40;
var chord_icon_y = 48;
var stroke_icon_y = 60;
var tab_line_A_y = 80;
var tab_line_E_y = 96;
var tab_line_C_y = 112;
var tab_line_G_y = 128;
var lyric_text_y = 160;
var note_space = 36;
var note_icon;          // 운지 위치 (flet)을 표시하는 숫자들
var total_chord_table;  // 코드 테이블을 모아 둔 비트맵

var song_data = null;    // 우쿨렐레 TAB 악보를 저장할 JSON 객체. 

var draw_tab_lines = function(ctx) {
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas_width,canvas_height);
  ctx.lineWidth = "2px";
  ctx.fillStyle = "black";
  ctx.moveTo(10,tab_line_A_y);    ctx.lineTo(canvas_width-20, tab_line_A_y);
  ctx.moveTo(10,tab_line_E_y);    ctx.lineTo(canvas_width-20, tab_line_E_y);
  ctx.moveTo(10,tab_line_C_y);    ctx.lineTo(canvas_width-20, tab_line_C_y);
  ctx.moveTo(10,tab_line_G_y);    ctx.lineTo(canvas_width-20, tab_line_G_y);
  ctx.stroke();
  ctx.font = '18px NotoSansCJKKR';
  // 'TAB' 표시 
  ctx.drawImage(note_icon, 19*18, 0, 28, 63,   10, tab_line_A_y-8, 28, 63);     // src_x, y, w, h ,  dst x, y, w, h
}

var calculate_note_space = function(data) {
  console.log("bpm:"+data.bpm+", beat:"+data.basic_beat );
/*  switch(data.basic_beat) {
    case "2/4":
      bpm = 
      break;
    case "3/4":
      break;
    case "4/4":
      break;
    case "6/8":
      break;
    default:
      break;
  }
*/
}
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


var draw_notes = function(ctx, data) {
  console.log("song_data.length = "+ data.notes.length );
  var xpos;
  for (var i=0; i<data.notes.length; i++) {
    // console.log("index="+i+", chord="+data.notes[i].chord );
    xpos = draw_start_x+ (data.notes[i].timestamp/624) *note_space;
    if (xpos >= canvas_width)
      break;
    draw_a_note(ctx, data.notes[i], xpos );
  }

}

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

  if (data.chord) {         // 코드를 표시
    var chord_index = chord_name_table.indexOf(data.chord);
    ctx.drawImage(total_chord_table, (chord_index%14)*50, parseInt(chord_index/14)*54, 49,53,  xpos, 10,  49, 53);
  }
  // if (data.stroke) {         // 스트로크를 표시
  //   ctx.fillText( data.chord, xpos, stroke_icon_y );
  // }


  if (g != undefined ) {
    ctx.drawImage(note_icon, g*18, c_g, 15, 12,   xpos, tab_line_G_y-8, 16, 14);     // src_x, y, w, h ,  dst x, y, w, h
  }
  if (c != undefined ) {
    ctx.drawImage(note_icon, c*18, c_c, 15, 12,   xpos, tab_line_C_y-8, 16, 14);     // src_x, y, w, h ,  dst x, y, w, h
  }
  if (e != undefined ) {
    ctx.drawImage(note_icon, e*18, c_e, 15, 12,   xpos, tab_line_E_y-8, 16, 14);     // src_x, y, w, h ,  dst x, y, w, h
  }
  if (a != undefined ) {
    ctx.drawImage(note_icon, a*18, c_a, 15, 12,   xpos, tab_line_A_y-8, 16, 14);     // src_x, y, w, h ,  dst x, y, w, h
  }

  if (data.lyric) {
    ctx.fillText( data.lyric, xpos, lyric_text_y );
  }

  if (data.technic) {
    if (data.technic.indexOf("|") >= 0) {   // 마디 표시
      ctx.fillRect(xpos-2, tab_line_A_y, 1, (tab_line_G_y-tab_line_A_y) );
    }
  }
}


window.onload = function main() {

  ////  bitmap resources ready.
  note_icon = document.getElementById("uke_note");
  total_chord_table = document.getElementById("whole_chords");

  ////  loading *.uke JSON data
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          song_data = JSON.parse(this.responseText);
          console.log("--> parsing Song file" );
          draw_tabulature();
    }
  };
  console.log("request Song file" );
  // xmlhttp.open("GET", "http://ccash.gonetis.com:88/uke_blog/data/itsumonandodemo.json", true);
  xmlhttp.open("GET", "http://ccash.gonetis.com:88/uke_blog/data/hawaiian_lovesong.json", true);
  // xmlhttp.open("GET", "http://ccash.gonetis.com:88/uke_blog/data/sometimes_telling_old_story.json", true);
  // xmlhttp.open("GET", "http://ccash.gonetis.com:88/uke_blog/data/appointment_of_world.json", true);
  xmlhttp.send();

  ////  Drawing Tabulature
  resize_canvas( window.innerWidth-30);
}

window.addEventListener("resize", window_resized);

function window_resized(event) {
  resize_canvas (event.target.innerWidth-30 );
}

function resize_canvas(cnvs_width) {
  var cnvs = document.getElementsByClassName("tabulature");
  for (var i = 0; i<cnvs.length; i++ ) {
    cnvs[i].width = cnvs_width;     // event.target.innerWidth-30;
    cnvs[i].height = 200;     // event.target.innerWidth-30;
  }
  canvas_width = cnvs_width;
  draw_tabulature();
}

function draw_tabulature() {
  var cnvs = document.getElementsByClassName("tabulature");
  canvas_width = cnvs[0].width;
  canvas_height = cnvs[0].height;
  var ctx = cnvs[0].getContext("2d");
  ctx.textBaseline = 'top';
  ctx.font = '18px NotoSansCJKKR';
  ctx.fillStyle = 'white';
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  ctx.fillStyle = 'black';

  if (song_data == null )
    return;
  console.log("song_data="+song_data.title );
  calculate_note_space(song_data);

  draw_tab_lines(ctx);
  draw_notes(ctx, song_data);
}

