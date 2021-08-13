var canvas_width = 0, canvas_height = 0;
var drawing_start = 0;      // 캔버스에 그려질 TAB 악보의 시작점. - 각 마디/라인 마다 캔버스를 분리해서 그릴 경우.

var draw_start_x = 40;
var chord_icon_y = 52;
var stroke_icon_y = 60;
var tab_line_A_y = 80;
var tab_line_E_y = 96;
var tab_line_C_y = 112;
var tab_line_G_y = 128;
var lyric_text_y = 160;
var note_space = 36;

var song_data = null;    // 우쿨렐레 TAB 악보를 저장할 JSON 객체. 

var draw_tab_lines = function(ctx) {
  ctx.font = '18px NotoSansCJKKR';
  ctx.fillText("T", 16, tab_line_A_y+14);
  ctx.fillText("A", 16, tab_line_A_y+30);
  ctx.fillText("B", 16, tab_line_A_y+46);
  ctx.lineWidth = "2px";
  ctx.moveTo(10,tab_line_A_y);    ctx.lineTo(canvas_width-20, tab_line_A_y);
  ctx.moveTo(10,tab_line_E_y);    ctx.lineTo(canvas_width-20, tab_line_E_y);
  ctx.moveTo(10,tab_line_C_y);    ctx.lineTo(canvas_width-20, tab_line_C_y);
  ctx.moveTo(10,tab_line_G_y);    ctx.lineTo(canvas_width-20, tab_line_G_y);
  ctx.stroke();
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
  data.tab.forEach(element => {
    switch(element.substr(0,1) ) {
      case "G":
        f_g = element.substr(-1);
        g = ( f_g >= 'a' ) ? element.substr(1,element.length-2) : element.substr(1);
        break;
      case "C":
        f_c = element.substr(-1);
        c = ( f_c >= 'a' ) ? element.substr(1,element.length-2) : element.substr(1);
        break;
      case "E":
        f_e = element.substr(-1);
        e = ( f_e >= 'a' ) ? element.substr(1,element.length-2) : element.substr(1);
        break;
      case "A":
        f_a = element.substr(-1);
        a = ( f_a >= 'a' ) ? element.substr(1,element.length-2) : element.substr(1);
        break;
    }
  });

  if (data.chord) {         // 코드를 표시
    ctx.fillText( data.chord, xpos, chord_icon_y );
  }
  // if (data.stroke) {         // 스트로크를 표시
  //   ctx.fillText( data.chord, xpos, stroke_icon_y );
  // }

  if (g != undefined ) {
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(xpos, tab_line_G_y-8, 16, 16);
    ctx.fillStyle = 'black';
    ctx.fillText( g , xpos, tab_line_G_y+8);
  }
  if (c != undefined ) {
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(xpos, tab_line_C_y-8, 16, 16);
    ctx.fillStyle = 'black';
    ctx.fillText( c , xpos, tab_line_C_y+8);
  }
  if (e != undefined ) {
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(xpos, tab_line_E_y-8, 16, 16);
    ctx.fillStyle = 'black';
    ctx.fillText( e , xpos, tab_line_E_y+8);
  }
  if (a != undefined ) {
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(xpos, tab_line_A_y-8, 16, 16);
    ctx.fillStyle = 'black';
    ctx.fillText( a , xpos, tab_line_A_y+8);
  }

  if (data.lyric)
    ctx.fillText( data.lyric, xpos, lyric_text_y );

}

window.onload = function main() {

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    console.log("--> received Song file" );
    if (this.readyState == 4 && this.status == 200) {
          song_data = JSON.parse(this.responseText);
          console.log("--> parsing Song file" );
          draw_tabulature();
    }
  };
  console.log("request Song file" );
  xmlhttp.open("GET", "http://ccash.gonetis.com:88/uke_blog/data/itsumonandodemo.json", true);
  xmlhttp.send();

}


function draw_tabulature() {
  var cnvs = document.getElementById("tabulature");
  canvas_width = cnvs.width;
  canvas_height = cnvs.height;
  var ctx = cnvs.getContext("2d");
  ctx.font = "36px NotoSansKR";
  // ctx.textBaseline = 'top';

  console.log("song_data="+song_data.title );
  calculate_note_space(song_data);
  let sizeText = "canvas size: " + cnvs.width + " x " + cnvs.height + ";";

  // ctx.fillText("Hello World! " + sizeText , 100, 60 );
  draw_tab_lines(ctx);

  draw_notes(ctx, song_data);
}

/*

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        document.getElementById("demo").innerHTML = myObj.name;
    }
};
xmlhttp.open("GET", "json_demo.txt", true);
xmlhttp.send();

*/
