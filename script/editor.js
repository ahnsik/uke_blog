/* ================================
    우쿨렐레 악보에 MP3 싱크 맞추는 프로그램.
================================ */

// import waveformDraw from "./script/waveformDraw";

const song_list = [
  "오르트 구름 - 윤하",
  "60 BPM 4/4박자 드럼비트 (48000Hz)",
  "60 BPM 3/4박자 모노 드럼비트 (8000Hz)",

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
  "너에게 난 나에게 넌 - 자탄풍(자전거 탄 풍경)",
  "사건의 지평선 - 윤하"
];
var host_url = "http://ccash2.gonetis.com:88";
const file_list = [
  host_url+"/uke_blog/data/oort_cloud-yunha.json",
  host_url+"/uke_blog/data/60BPM_Drum_Beat_3min_48000Hz.json", 
  host_url+"/uke_blog/data/60Bpm_3-4Beat_Drum_8bit_mono_8000hz.json", 

  host_url+"/uke_blog/data/hawaiian_lovesong.json",
  host_url+"/uke_blog/data/itsumonandodemo.json",
  host_url+"/uke_blog/data/sometimes_telling_old_story.json",
  host_url+"/uke_blog/data/appointment_of_world.json",
  host_url+"/uke_blog/data/hikoki_gumo.json",
  host_url+"/uke_blog/data/elcondorpasa_fingerstyle.json",
  host_url+"/uke_blog/data/elcondorpasa_melody.json",
  host_url+"/uke_blog/data/kiss_the_rain_new.json",
  host_url+"/uke_blog/data/kokuriko-ghibri.json",
  host_url+"/uke_blog/data/merry_go_round_in_Life.json",
  host_url+"/uke_blog/data/rain_and_you.json",
  host_url+"/uke_blog/data/umigamierumachi.json",
  host_url+"/uke_blog/data/SomewhereOvertheRainbow.json",
  host_url+"/uke_blog/data/me_toyou_you_tome.json",
  host_url+"/uke_blog/data/event_horizon-yunha.json"
];

/////// about Editor resize & UKE_Document
var initialSelect = 0;
var array_l = [];     // wav buffer
var canvas_width, canvas_height;

var START_XPOS = 0;     // ??

var scrollPosition_msec = 0;

/* ================================
    HTML 로드 되고 초기화 동작. - resource load, etc..
================================ */
window.onload = function main() {

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
    xmlhttp.open("GET", file_list[selector.selectedIndex], true);
    xmlhttp.send();
  }

  ////  loading *.uke JSON data
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      song_data = JSON.parse(this.responseText);
      let dom_bpm = document.getElementById("bpm");
      dom_bpm.value = parseFloat(song_data.bpm);
      console.log("[][] BPM value set:" + dom_bpm.value + " (from:" + song_data.bpm + ")"  );
      let dom_offset = document.getElementById("offset");
      dom_offset.value = parseInt(song_data.start_offset);
      waveformDraw.set_startOffset(dom_offset.value);
      let dom_beat = document.getElementById("signature");
      dom_beat.value = song_data.basic_beat;
      console.log("[][] 박자:" + song_data.basic_beat );
      let edit_size = document.getElementById("quaver_mode");
      edit_size.selectedIndex = (song_data.editsize == 16)?1:0;    // default값 = seleted=1 = 8분음표 편집
      // g_edit_size = (edit_size.selectedIndex == 0)?8:16;    // 8음표2개 or 16분음표4개
      // console.log("[][] 편집단위:" + edit_size.value + ", 데이터:" + song_data.editsize + ", 변수값:" + g_edit_size );
      scrollPosition_msec = 0;

      // MP3 파일 로딩.
      audioTag = document.getElementById("playing_audio");
      if (song_data.source.length > 0) {
        console.log("음원파일:" + song_data.source + "("+song_data.source.length+")"+", loaded="+array_l.length );
        request_mp3(song_data.source);
        document.getElementById("loadMP3_file").innerText = song_data.source;
      } else {
        console.error("clear array_l. loaded="+array_l.length );
        array_l = [];
      }
      calc_note_size();
      change_speed(1.0);
      //  Drawing Tabulature
      resize_canvas( window.innerWidth-40);
    }
  };
  xmlhttp.open("GET", file_list[initialSelect], true);
  xmlhttp.send();

  waveformDraw.init();
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

window.addEventListener("resize", window_resized);
function window_resized(event) {
  dlg_wnd = document.getElementsByClassName("dialog");
  console.log("num="+dlg_wnd.length);
  for (let i=0; i<dlg_wnd.length; i++) {
    let w = dlg_wnd[i].offsetWidth;
    let h = dlg_wnd[i].offsetHeight;
    dlg_wnd[i].style.left = (event.target.innerWidth-w)/2 + "px";
    dlg_wnd[i].style.top = "30px";     // (event.target.innerHeight-h-80)/2 + "px";    // 80은 그냥 조정값.
    console.log("i="+i+", width=" + w+", height=" + h );
  }

  console.log("resize window.." );
  resize_canvas (event.target.innerWidth-40 );
}

///////////////////////////////////////////////////////////////
//// 본격적인 Drawing 함수들의 시작.
///////////////////////////////////////////////////////////////

let edit_area = document.getElementById("waveformCanvas");

function resize_canvas(cnvs_width) {
  canvas_width = cnvs_width;
  canvas_height = 160;  

  edit_area.width = cnvs_width;     // event.target.innerWidth-30;
  edit_area.height = canvas_height;
  edit_area.ondblclick = edit_mouseDblClick;
  edit_area.onmousedown = edit_mouseDown;
  edit_area.onmousemove = edit_mouseMove;
  edit_area.onmouseup = edit_mouseUp;
  edit_area.onwheel = edit_wheelScroll;
  // edit_area.onkeydown = edit_keyDown;
  // edit_area.onkeyup = edit_keyUp;

  // waveformDraw.init();
  waveformDraw.set_windowSize(0, 0, canvas_width, canvas_height);
  draw_editor(edit_area);
}

////// About UKE documents - BMP, samplate, etc,,

var g_sampleRate = 0;        // 1초당 sound sample 수.. --> 이 값에 따라 grid 의 pixel 간격이 달라질 수 있으므로 주의.
var g_totalMsec = 0;         // 음악 전체의 길이 (msec단위)

var signature_divider = 8;   // 마디 당 quaver 수, default 는 4/4 박자, 8분음표
// var g_edit_size = 8;         // 8=quaver(8분음표), 16=semi-quaver(16분음표)
var g_bpm = 60;
var g_offset = 0;
var g_numSmp_per_px = 256;     // number of samples per pixel;        --> 1, 2, 4, 8, 16, 32, 64, 128, .. <-- 확대/축소 배율

var g_numSmp_per_msec = g_sampleRate/1000;
var g_msec_per_quaver = (30000/g_bpm);    // 30000 은 8분음표 니까.
var g_numSmp_per_quaver = (g_sampleRate*30) / g_bpm;      // 기준 음표(8분음표or16분음표)가 차지하는 가로 pixel 크기    // var grid_width = 20;        // 1개 단위음 (8분음표 or 16분음표) 크기 - BPM 및 확대/축소에 따라, 박자(signature)에 따라 크기가 변경된다.
var g_numPx_per_quaver = g_numSmp_per_quaver / g_numSmp_per_px;   // 마우스 드래그로 이동 시킬 때의 위치 표시용, 1개 음표 크기 (pixel)
var g_ms_for_quaver;  // = parseInt((g_numSmp_per_quaver*1000)/g_sampleRate);

var moving_note_idx = -1;     // 마우스 드래그로 음표를 이동시킬 때의 index.
var note_idx_editing = -1;    // Dialog 에서 편집중인 음표의 index.
var copy_head_idx = -1;
var copy_tail_idx = -1;


//// MP3 데이터를 로딩 하여 디코딩 요청.
function request_mp3(filename) {
  stop_song();
  if (filename) {       //  loading *.MP3 data :   refer : https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
    array_l = [];
    audioTag.src = host_url+"/uke_blog/data/"+filename;
    if (!filename || filename.length == 0) {
      console.log("음원파일을 지정하지 않았습니다..");
      return;
    } else {
      console.log("음원파일 = " + filename);
    }
    var oReq = new XMLHttpRequest();
    oReq.open("GET", host_url+"/uke_blog/data/"+filename, true);
    oReq.responseType = "arraybuffer";
    oReq.onload = function() {
      console.log("xmlhttpReq... sftp://ccash2.gonetis.com:/home/ahnsik/ukulele/"+filename);
      if (this.readyState != 4 || this.status != 200) {
        console.log("... readyState=" + this.readyState + ", status="+this.status );
        return;
      }
      let mp3Buffer = oReq.response; // Note: not oReq.responseText
      console.log("start decode MP3");
      mp3Decode(mp3Buffer);         // 디코딩 된 mp3 데이터는 0번채널을 array_l 라는 버퍼에 float32 데이터로 저장해 담아 둔다.
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
  let wavefrom_size = canvas_width; //parseInt( (H_WAVEFORM-1)/2 );
  const length = float32Array_l.length;
  array_l = float32Array_l;

  waveformDraw.set_audioBuffer(array_l, g_sampleRate);
  waveformDraw.set_scrollPos(0);
  draw_editor(edit_area);
}

///////////////////////////////////////////////////////////////
//// 편집화면영역(waveform, TAB, etc..)을 Drawing
///////////////////////////////////////////////////////////////
var draw_editor = (canvas) => {
  canvas.width = canvas_width;
  canvas.height = canvas_height;

  // console.log(" scrollPosition_msec = "+ scrollPosition_msec );

  let ctx = canvas.getContext("2d");
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'white';
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  ctx.imageSmoothingEnabled= true;

  calc_note_size();     // samplesPerPixel, zoomFactor 등을 계산

  // waveformDrawWithMsec(ctx, 10, 3, canvas_width, canvas_height, array_l);
  waveformDraw.set_playingPosition(audioTag.currentTime);
  waveformDraw.drawBg(ctx);
  waveformDraw.draw(ctx);
  waveformDraw.drawRuler(ctx);
}

/* canvas width 에 맞춰서 pixel 별로, 해당 pixel (xpos)에 해당하는 msec 값을 구한 다음에, 
   해당 msec 를 기준으로 모든 것을 판단하고 drawing 하도록 한다. 
*/

// var waveformDraw = (ctx, xpos, ypos, width, height, wavBuffer) => {      // samplingdata 의 index값이 기준이 되어 그림을 그리는 함수.

//   let i, j, min, max, temp_index, index_withOffset, value;
//   let wavefrom_size = height;
//   let waveform_offset = 0;  //parseInt(g_offset * g_sampleRate/1000);

//   let current_playing_index = audioTag.currentTime*g_sampleRate + waveform_offset;

//   // if ( ! audioTag.paused ) {    // 재생 중인 동안에는, Playing Position 위치에 맞게 자동으로 scrolling..
//   //   let leftScrollLimit = 0;      /// -(START_XPOS*g_numSmp_per_px);    // TODO: 그래프에서 왼쪽에 label 표시 영역 처리해야 하는데...
//   //   let rightScrollLimit = ((canvas_width-xpos)*g_numSmp_per_px*0.4);   // 화면 크기의 40%진행 위치
//   //   if ( (current_playing_index-scrollPosition_msec) > rightScrollLimit ) {
//   //     scrollPosition_msec = parseInt(current_playing_index - rightScrollLimit ) ;
//   //   }
//   //   if ( (current_playing_index-scrollPosition_msec) < leftScrollLimit ) {
//   //     scrollPosition_msec = parseInt(current_playing_index);
//   //   }
//   // }

//   /* 음파 Waveform과 데이터를 나중에 그려 줘야 함. - 동시에 그리면 그려진 글자가 지워지므로. */
//   let center_y = ypos+height/2;  // canvas center 에 그리기 위해서 
//   let xpos_prime = xpos+0.5;     // 단지 draw를 하기 위해 위치 보정
//   let scrollPosition_index = scrollPosition_msec * g_numSmp_per_msec;
//   for ( i = 0; i< (canvas_width-xpos); i++ ) {
//     min= 1.0; max= -1.0;      
//     temp_index = (i*g_numSmp_per_px)+scrollPosition_index;
//     index_withOffset = temp_index +waveform_offset;
//     if ( (typeof(temp_index)!="number") || 
//           (typeof(scrollPosition_index)!="number") ||
//           (typeof(waveform_offset) != "number") ) {
//       console.error ( "typeof temp_index="+typeof(temp_index)+ ", typeof scrollPosition_index="+typeof(scrollPosition_index)+ ",typeof g_offset="+typeof(waveform_offset) );
//     }
//     // min-max 계산
//     for ( j=0; j<g_numSmp_per_px; j++) {
//       value = wavBuffer[temp_index +j ];
//       if ( value >= max)
//         max = value;      //parseInt(value);
//       if ( value <= min)
//         min = value;      //parseInt(value);
//     }

//     // BG color : BPM에 맞춰서..

//     // WAVE 파형 그리기.
//     if ( index_withOffset < current_playing_index ) { 
//       ctx.strokeStyle = "grey"; // WAVEFORM_COLOR_PAST;
//     } else {
//       if ( ( parseInt(index_withOffset/g_sampleRate) % 2) == 0 ) {   // 초단위 구분을 위한 색깔 변화
//         ctx.strokeStyle = "yellow"; // WAVEFORM_COLOR_EVEN;
//       } else {
//         ctx.strokeStyle = "green"; // WAVEFORM_COLOR_ODD;
//       }
//     }
//     ctx.beginPath();
//     ctx.moveTo( xpos_prime+ i, center_y + min*height );
//     ctx.lineTo( xpos_prime+ i, center_y + max*height );
//     ctx.stroke();
//   }

// }


var play_handler = null;
var speed_multiplier = 1.0;

var play_song = () => {
  if ( audioTag.paused ) {   
    audioTag.play();
    document.getElementById("play_song").src = "common/pause.svg" ;
    play_handler = setInterval( function() {
      draw_editor(edit_area);
      if (audioTag.ended) {
        stop_song();
      }
    }, 50);
  } else {
    audioTag.pause();
    document.getElementById("play_song").src = "common/play.svg" ;
    clearInterval(play_handler);
    play_handler = null;
    draw_editor(edit_area);
  }
};

var stop_song = () => {
  audioTag.pause();
  audioTag.currentTime = 0;
  document.getElementById("play_song").src = "common/play.svg" ;
  clearInterval(play_handler);
  play_handler = null;
  draw_editor(edit_area);
}

var goto_head = () => {
  audioTag.currentTime = 0;
  scrollPosition_msec = 0;
  waveformDraw.set_scrollPos(scrollPosition_msec);
  draw_editor(edit_area);
}

var rewind_10sec = () => {
  if (audioTag.currentTime > 10) {
    audioTag.currentTime = audioTag.currentTime-10;
  } else {
    audioTag.currentTime = 0;
  }
  draw_editor(edit_area);
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
  waveformDraw.zoom_in();
  draw_editor(edit_area);
}

var zoom_out = function () {
  waveformDraw.zoom_out();
  draw_editor(edit_area);
}

var calc_note_size = () => {   // samplesPerPixel, zoomFactor 등을 계산
  g_bpm = parseInt(document.getElementById("bpm").value);
  song_data.bpm = g_bpm;
  g_offset = parseInt(document.getElementById("offset").value);
  song_data.start_offset = g_offset;
  let editSize = song_data.editsize = (document.getElementById("quaver_mode").selectedIndex == 0)?8:16;    // 8음표2개 or 16분음표4개

  g_numSmp_per_msec = (g_sampleRate/1000);
  g_msec_per_quaver = 30000 / g_bpm; 
/*   8분음표(?)1개는 몇 msec 인가 ?   : 참고링크 : https://www.cuonet.com/bbs/board.php?bo_table=qna2&wr_id=999237 
    60bmp 이라면..?  4분음표=1000,  8분음표=500,
    80bmp 이라면..?  60000 / 80 ==> 4분음표: 750 msec, 8분음표 = 375msec.
    즉, 8분음표 = 30000/bpm,  4분음표 = 60000/bpm 이 된다. 
*/
  // console.log("SampleRate = "+g_sampleRate+", g_numSmp_per_msec = "+ g_numSmp_per_msec + ", g_bpm = "+g_bpm+", g_msec_per_quaver="+g_msec_per_quaver);

  g_numSmp_per_quaver = (g_sampleRate*(30*8/editSize) ) / g_bpm;
  g_numPx_per_quaver = g_numSmp_per_quaver / g_numSmp_per_px ;
  // g_ms_for_quaver = parseInt((g_numSmp_per_quaver*1000)/g_sampleRate);
  // console.log(".. g_numSmp_per_quaver = "+ g_numSmp_per_quaver + ", g_numPx_per_quaver = "+g_numPx_per_quaver );

  let _sign = document.getElementById("signature").value;
  song_data.basic_beat = _sign;

  switch(_sign) {       // 1마디에 들어갈 음표 갯수
    case "2/4":
      signature_divider = editSize / 2;   // (8분음표는 4개, 16분 음표는 8개)
      break;
    case "3/4":
      signature_divider = editSize*3 / 4;   // (8분음표는 6개, 16분 음표는 12개)
      break;
    case "6/8":
      signature_divider = editSize*6 / 8;   // (8분음표는 6개, 16분 음표는 12개)
      break;
    case "4/4":
      signature_divider = editSize;         // (8분음표는 8개, 16분 음표는 16개)
      break;
    default:
      signature_divider = parseInt( editSize * _sign.split('/')[0] / _sign.split('/')[1] );
      console.log("_sign="+_sign+ ", split[0]="+parseInt(_sign.split('/')[0])+ ", divider=" + signature_divider );
      break;
  }

  ////////////////////// 새로운 drawing 방법을 위해.. - global 변수를 사용하지 않도록.
  // let quaverSize = (30000/g_bpm) * 8 / signature_divider
  // console.log("signature_divider=",signature_divider, ", quaverSize = ", quaverSize )
  waveformDraw.set_quaverSize(30000/g_bpm);    // 30000/g_bpm);     //g_msec_per_quaver);
  waveformDraw.set_wordSize(signature_divider); //song_data.editsize);
}

var quaver_changed = () => {
  waveformDraw.set_semiQuaver( (document.getElementById("quaver_mode").selectedIndex == 0)?true:false );
  g_edit_size = (document.getElementById("quaver_mode").selectedIndex == 0)?8:16;    // 8음표2개 or 16분음표4개
  console.log("편집단위:" + g_edit_size + "분음표로 편집");
  song_data.editsize = g_edit_size;
  calc_note_size();
  draw_editor(edit_area);
}
var bpm_changed = () => {
  g_bpm = document.getElementById("bpm").value;
  console.log("BPM:" + g_bpm);
  calc_note_size();
  draw_editor(edit_area);

}
var offset_changed = () => {
  g_offset = parseInt(document.getElementById("offset").value);
  // console.log("playing offset:" + g_offset+", scrollPosition_msec="+scrollPosition_msec);
  calc_note_size();
  waveformDraw.set_startOffset(g_offset);
  draw_editor(edit_area);
}
var signature_changed = () => {
  let value = document.getElementById("signature").value;
  console.log("Signature:" + value);
  calc_note_size();
  draw_editor(edit_area);
}


var last_posX=0, last_posY=0;
var last_timeStamp = 0;
var scroll_x = 0, prev_position=0;
var click_pos = null;
var isDragging = false;
var isScrollMode = false;

/*
var edit_keyDown = (e) => {
  console.log("keydown : shift is " + e.isshiftKey );
  if (e.isshiftKey)
    isShiftMode = true;
}
var edit_keyUp = (e) => {
  console.log("keyup : shift is " + e.isshiftKey );
  if (e.isshiftKey)
    isShiftMode = false;
}
*/
var edit_mouseDown = (e) => {
  const rect = edit_area.getBoundingClientRect();
  last_posX = e.clientX - rect.left;
  last_posY = e.clientY - rect.top;

  isScrollMode = true;
  scroll_x = 0;
  prev_position = scrollPosition_msec = waveformDraw.get_scrollPos();    // waveformDraw.startOffset;  //
  console.log("clicked - startOffset=", scrollPosition_msec );
  isDragging = true;
  // isTsMoved = false;
  e.preventDefault();
}
var edit_mouseMove = (e) => {

  if (isDragging) {
    const rect = edit_area.getBoundingClientRect();
    let cursor_x = e.clientX - rect.left;
    let cursor_y = e.clientY - rect.top;

    console.log("mousemove - startOffset=", scrollPosition_msec );

    if (isScrollMode) {
        scroll_x = (cursor_x-last_posX);       // (cursor_x-last_posX)*g_numSmp_per_px;
        scrollPosition_msec = prev_position-(scroll_x * waveformDraw.get_msecPerPixel() );
        console.log("move - startOffset=", scrollPosition_msec );
        waveformDraw.set_scrollPos(scrollPosition_msec);
      
    } else {
      if (moving_note_idx !== -1) {    // 만약 뭔가 데이터를 편집 중이라면, = Dialog 가 표시된 상태라면,
        console.log("선택된 note 를 drag 해서 이동시킨다");
        let temp_idx = (cursor_x-START_XPOS)*g_numSmp_per_px+scrollPosition_msec;
        let clicked_ts = parseInt(temp_idx*1000/g_sampleRate+g_offset);
        let note_ts = parseInt(clicked_ts/g_ms_for_quaver)*g_ms_for_quaver;
        if (e.altKey) {     // ALT 키가 눌려 있을 때에는, Grid 에 고정하지 않는다.
          note_ts = clicked_ts;
        }
        if (e.shiftKey) {   // 뒤에 있는 모든 index의 timeStamp들을 같은 크기 만큼 함께 조정한다.
          console.log("All timestamp will be changed");
          let notes = song_data.notes;
          let diff = (note_ts - notes[moving_note_idx].timestamp);
          for (let i = moving_note_idx; i< notes.length; i++) {
            notes[i].timestamp += diff;
          }
        } else {
          song_data.notes[moving_note_idx].timestamp = note_ts;
        }
      }
    }
    draw_editor(edit_area);
  }
  e.preventDefault();
}
var edit_mouseUp = (e) => {
  last_posX = 0;
  last_posY = 0;
  last_timeStamp = 0;

  if (scrollPosition_msec === prev_position) {   // 스크롤 되지 않았음. note 편집.
    if (moving_note_idx !== -1) {    // TS 값을 조정 중이었다면, 
      console.log("여기에서는 새로운 음을 편집하게 될 것?");
    } else {
      const rect = edit_area.getBoundingClientRect();
      let cursor_x = e.clientX - rect.left;
      if (cursor_x > START_XPOS) {
        let temp_idx = (cursor_x-START_XPOS)*g_numSmp_per_px+scrollPosition_msec;
        let clicked_ts = parseInt(temp_idx*1000/g_sampleRate+g_offset);
        console.log("clicked xpos="+cursor_x+", clicked_ts:"+clicked_ts );
      }
      console.log("분명히 편집 창을 열어야 할 텐데?");
    }
  } else {      // 스크롤 된 상태 
    const rect = edit_area.getBoundingClientRect();
    let cursor_x = e.clientX - rect.left;
    let temp_idx = (cursor_x-START_XPOS)*g_numSmp_per_px+scrollPosition_msec;
    let clicked_ts = parseInt(temp_idx*1000/g_sampleRate+g_offset);

    if (isScrollMode) {
      scrollPosition_msec = prev_position-(scroll_x * waveformDraw.get_msecPerPixel() );
      waveformDraw.set_scrollPos(scrollPosition_msec);
    }
  }
  moving_note_idx = -1;
  isScrollMode = false;
  isDragging = false;
  draw_editor(edit_area);
  e.preventDefault();
}

var edit_mouseDblClick = (e) => {
  console.log("Double Click" );
  const rect = edit_area.getBoundingClientRect();
  let cursor_x = e.clientX - rect.left;
  let temp_idx = (cursor_x-START_XPOS)*g_numSmp_per_px+scrollPosition_msec;
  let clicked_ts = parseInt(temp_idx*1000/g_sampleRate+g_offset);
  console.log("clicked xpos="+cursor_x+", clicked_ts:"+clicked_ts );
}

var edit_wheelScroll = (e) => {
  scrollPosition_msec += parseInt(e.deltaY/2)*g_numSmp_per_px;
  waveformDraw.set_scrollPos(scrollPosition_msec);

  draw_editor(edit_area);
}

