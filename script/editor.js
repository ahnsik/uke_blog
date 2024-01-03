/* ================================
    우쿨렐레 악보에 MP3 싱크 맞추는 프로그램.
================================ */

// import waveformDraw from "./script/waveformDraw";
const AUTOSCROLL_LEFT_LIMIT = 2000;
// const AUTOSCROLL_RIGHT_LIMIT = 1000;

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
const host_url = "http://ccash2.gonetis.com:88";
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

const START_XPOS = 0;     // ??
const MINIMUM_WAVE_SIZE = 120;

/////// about Editor resize & UKE_Document
var initialSelect = 0;
var song_data = null;
var array_l = [];     // wav buffer
var canvas_width, canvas_height;

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
      uke_json_parsing(this.responseText);
      resize_canvas( window.innerWidth, window.innerHeight );
    }
  };
  xmlhttp.open("GET", file_list[initialSelect], true);
  xmlhttp.send();

  waveformDraw.init();
}

var uke_json_parsing = (jsonText) => {
    song_data = JSON.parse(jsonText);
    
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
    waveformDraw.set_semiQuaver( (edit_size.selectedIndex == 0)?true:false );

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
  for (let i=0; i<dlg_wnd.length; i++) {
    let w = dlg_wnd[i].offsetWidth;
    let h = dlg_wnd[i].offsetHeight;
    dlg_wnd[i].style.left = (event.target.innerWidth-w)/2 + "px";
    dlg_wnd[i].style.top = "30px";
  }
  resize_canvas( window.innerWidth, window.innerHeight );
}

///////////////////////////////////////////////////////////////
//// 본격적인 Drawing 함수들의 시작.
///////////////////////////////////////////////////////////////

let edit_area = document.getElementById("waveformCanvas");

function resize_canvas(cnvs_width, cnvs_height) {
  canvas_width = cnvs_width - 32; // 32=padding,
  canvas_height = cnvs_height-340;    // 300 = 각종 song data 속성 및 control form area size...
  if (canvas_height < (MINIMUM_WAVE_SIZE+280) ) {   //  280 = TAB_EDIT_HEIGHT
    canvas_height = (MINIMUM_WAVE_SIZE+280);
    console.log("canvas size is too small : ", cnvs_height, ", change to : ", canvas_height );
  }
  edit_area.width = cnvs_width;
  edit_area.height = canvas_height;
  edit_area.ondblclick = edit_mouseDblClick;
  edit_area.onmousedown = edit_mouseDown;
  edit_area.onmousemove = edit_mouseMove;
  edit_area.onmouseup = edit_mouseUp;
  edit_area.onwheel = edit_wheelScroll;
  // // window.onkeydown = edit_keyDown;    // 윈도우에 키 이벤트를 넣어 주면..  stoppropagation 때문인지,  
  // // window.onkeyup = edit_keyUp;        // 마우스 클릭 시에 ALT 키 등을 인식할 수 없으므로.. window 에 핸들러를 붙이지 않는다. 
  // edit_area.addEventListener('keydown', edit_keyDown, false);
  // edit_area.addEventListener('keyup', edit_keyUp, false);

  waveformDraw.set_windowSize(0, 0, canvas_width, canvas_height);
  draw_editor(edit_area);
}

////// About UKE documents - BMP, samplate, etc,,

var g_bpm = 60;
var g_offset = 0;

///// 아래 각종 기준은 msec 단위로 처리.
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
  let float32Array_l = audioBuf.getChannelData(0);
  array_l = float32Array_l;

  waveformDraw.set_audioBuffer(array_l, audioBuf.sampleRate);
  waveformDraw.set_scrollPos(0);
  draw_editor(edit_area);
}

///////////////////////////////////////////////////////////////
//// 편집화면영역(waveform, TAB, etc..)을 Drawing
///////////////////////////////////////////////////////////////
var draw_editor = (canvas) => {
  canvas.width = canvas_width;
  canvas.height = canvas_height;

  let ctx = canvas.getContext("2d");
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'white';
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  ctx.imageSmoothingEnabled= true;

  calc_note_size();     // samplesPerPixel, zoomFactor 등을 계산

  waveformDraw.set_playingPosition(audioTag.currentTime);
  waveformDraw.drawBg(ctx);
  waveformDraw.drawWave(ctx);
  waveformDraw.drawNotes(ctx, song_data);
  waveformDraw.drawRuler(ctx );
}
/* canvas width 에 맞춰서 pixel 별로, 해당 pixel (xpos)에 해당하는 msec 값을 구한 다음에, 
   해당 msec 를 기준으로 모든 것을 판단하고 drawing 하도록 한다. 
*/

///////////////////////////////////////////////////////////////
//// 음악 재생 관련. Playing, Pause, 2배속 재생 등..
///////////////////////////////////////////////////////////////
var play_handler = null;
var speed_multiplier = 1.0;

var play_song = () => {
  if ( audioTag.paused ) {   
    audioTag.play();
    document.getElementById("play_song").src = "common/pause.svg" ;
    play_handler = setInterval( function() {
      // playing 위치를 좇아 가는 부분 ?
      let playingPosition_msec = audioTag.currentTime * 1000;
      scrollPosition_msec = playingPosition_msec;
      waveformDraw.set_scrollPos(playingPosition_msec - AUTOSCROLL_LEFT_LIMIT );
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
var fullWave = function () {
  waveformDraw.set_scaleFactor(0.5);
  draw_editor(edit_area);
}
var halfWave = function () {
  waveformDraw.set_scaleFactor(1.0);
  draw_editor(edit_area);
}


///////////////////////////////////////////////////////////////
//// Utility Functions & UI controls
///////////////////////////////////////////////////////////////

var calc_note_size = () => {   // samplesPerPixel, zoomFactor 등을 계산
  let signature_divider = 8;   // 마디 당 quaver 수, default 는 4/4 박자, 8분음표

  g_bpm = parseInt(document.getElementById("bpm").value);
  song_data.bpm = g_bpm;
  g_offset = parseInt(document.getElementById("offset").value);
  song_data.start_offset = g_offset;
  let editSize = song_data.editsize = (document.getElementById("quaver_mode").selectedIndex == 0)?8:16;    // 8음표2개 or 16분음표4개

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
  waveformDraw.set_quaverSize(30000/g_bpm);   // quaver 는 8분 음표 길이
  if (editSize==8) {
    waveformDraw.set_wordSize(signature_divider*2); //song_data.editsize);
  }
  else {
    waveformDraw.set_quaverSize(30000/g_bpm);   // quaver 는 8분 음표 길이
    waveformDraw.set_wordSize(signature_divider);
  }
}

var quaver_changed = () => {
  let edit_size = 8;
  if (document.getElementById("quaver_mode").selectedIndex == 0) {
    waveformDraw.set_semiQuaver( true );
    edit_size = 8;    // 8음표2개 or 16분음표4개
  } else {
    waveformDraw.set_semiQuaver( false );
    edit_size = 16;    // 8음표2개 or 16분음표4개
  }
  console.log("편집단위:" + edit_size + "분음표로 편집");
  song_data.editsize = edit_size;
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

///////////////////////////////////////////////////////////////
//// 마우스 이벤트 및 키 이벤트 등.  입력 UI 이벤트 핸들러..
///////////////////////////////////////////////////////////////
var last_posX=0, last_posY=0;
var scroll_x = 0, prev_position=0;
var isDragging = false;   // mousedown state
var isScrollMode = false;
var editing_note_index = -1;

var edit_keyDown = (e) => {
  let key_used = false;
  console.log("keydown : isShift is ", e.shiftKey, ", isCtrl is ", e.ctrlKey, ", isAlt is ", e.altKey );
  if (e.shiftKey) {
    isShiftMode = true;
  } else {
    let focused_msec = waveformDraw.get_focusPos_msec();
    let grid_msec = waveformDraw.get_msecPerGrid();
    if (e.keyCode == 39) {      // Arrow Right
      waveformDraw.set_focusPos( focused_msec + grid_msec );
      key_used = true;
    } else if (e.keyCode == 37) {      // Arrow Left
      waveformDraw.set_focusPos( focused_msec - grid_msec );
      key_used = true;
    } else if (e.keyCode == 38) {      // Arrow Up
      key_used = true;
    } else if (e.keyCode == 40) {      // Arrow Down
      key_used = true;
    } else if (e.keyCode == 13) {      // Enter key
      key_used = true;
    } else if (e.keyCode == 27) {      // ESC key
      key_used = true;
    }
  }
  draw_editor(edit_area);

  if (key_used) {
    e.preventDefault();
    e.stopPropagation()
  }
}
var edit_keyUp = (e) => {
  if (e.shiftKey)
    isShiftMode = false;
}

var edit_mouseDown = (e) => {
  const rect = edit_area.getBoundingClientRect();
  last_posX = e.clientX - rect.left;
  last_posY = e.clientY - rect.top;
  
  isDragging = true;
  // waveform 부분을 드래그 하면 스크롤 한다.
  if (waveformDraw.get_clickedCategory(last_posY)==0) {   // "waveform"
    isScrollMode = true;
    scroll_x = 0;
    prev_position = scrollPosition_msec = waveformDraw.get_scrollPos();    // waveformDraw.startOffset;  //
  } else {    // 그 외의 위치를 클릭하면, 
    // TODO: 편집 메뉴를 띄우거나 note 데이터(timestamp)를 이동시키거나 하는 등의 동작.
    let focus_in_msec = waveformDraw.get_msecPerPixel()*last_posX + scrollPosition_msec;
    // waveformDraw.set_focusPos(focus_in_msec);
    let grid_width_msec = waveformDraw.get_msecPerGrid();
    let grid_start_msec = parseInt(focus_in_msec / grid_width_msec) * grid_width_msec;    // 그리드 단위.
    editing_note_index = findNoteIndex(grid_start_msec, grid_start_msec+grid_width_msec);
    prev_position = song_data.notes[editing_note_index].timestamp;
    console.log("found note index=", editing_note_index, ", note.timestamp=", prev_position );
  }
  e.preventDefault();
}
var edit_mouseMove = (e) => {
  const rect = edit_area.getBoundingClientRect();
  let cursor_x = e.clientX - rect.left;
  let cursor_y = e.clientY - rect.top;

  if (isScrollMode) {     // 스크롤 중이면..
      scroll_x = (cursor_x-last_posX);
      scrollPosition_msec = prev_position-(scroll_x * waveformDraw.get_msecPerPixel() );
      if (scrollPosition_msec < 0)
        scrollPosition_msec = 0;
      waveformDraw.set_scrollPos(scrollPosition_msec);
      console.log("scroll mode");
  } else {    // 스크롤이 아닌 상태
    if (isDragging) {     // note 의 위치이동 (timestamp) 중이라면..
      console.log("dragging...", editing_note_index);
      //   // TODO: timestamp 조정 동작..
      let moving_x = (cursor_x-last_posX);
      moving_msec = prev_position+(moving_x * waveformDraw.get_msecPerPixel() );
      if (e.altKey) {     // ALT 키가 눌려 있을 때에는, Grid 에 고정하지 않는다.
        song_data.notes[editing_note_index].timestamp = moving_msec;
      } else {
        let gridSize = waveformDraw.get_msecPerGrid();
        let note_ts = parseInt(moving_msec/gridSize)*gridSize;
        console.log("idx=", editing_note_index, ", notes=", song_data.notes[editing_note_index], ", ts=", song_data.notes[editing_note_index].timestamp, ", moving=", moving_msec );
        song_data.notes[editing_note_index].timestamp = note_ts;
      }
      if (e.shiftKey) {
        let offset_msec = song_data.notes[editing_note_index].timestamp - prev_position;
        shiftAllTimestampAfter(editing_note_index+1, offset_msec);
      }
      console.log("moving_x=", moving_x, ", timestamp=", song_data.notes[editing_note_index].timestamp );
    } else {  // TODO: 그냥 커서만 이동 중 --> note 위치를 확인할 수 있도록 해 보자.
      let focus_line = waveformDraw.get_clickedCategory(cursor_y);
      // if (focus_line!="waveform") {
        let focus_in_msec = waveformDraw.get_msecPerPixel()*cursor_x + scrollPosition_msec;
        waveformDraw.set_focusPos(focus_in_msec);
        waveformDraw.set_focusCategory(focus_line);
      // } else {
      // }
    }
  }
  draw_editor(edit_area);

  e.preventDefault();
}
var edit_mouseUp = (e) => {
  last_posX = 0;
  last_posY = 0;

  if (scrollPosition_msec === prev_position) {   // 스크롤 되지 않았음. note 편집.
    if (moving_note_idx !== -1) {    // TS 값을 조정 중이었다면, 
      console.log("여기에서는 새로운 음을 편집하게 될 것?");
    } else {
      editing_note_index = -1;
    }
  } else {      // 스크롤 된 상태 
    const rect = edit_area.getBoundingClientRect();
    // let cursor_x = e.clientX - rect.left;
    if (isScrollMode) {
      scrollPosition_msec = prev_position-(scroll_x * waveformDraw.get_msecPerPixel() );
      if (scrollPosition_msec < 0)
        scrollPosition_msec = 0;
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
  const rect = edit_area.getBoundingClientRect();
  let cursor_x = e.clientX - rect.left;
  let cursor_y = e.clientY - rect.top;

  let grid_size = waveformDraw.get_msecPerGrid();
  let note_seq = parseInt(waveformDraw.get_clickedTimeStamp(cursor_x) / grid_size);
  let start_msec = note_seq * grid_size;
  let edn_msec = start_msec + grid_size;
  console.log("grid: size=",grid_size," from ", start_msec, " to ", edn_msec, ", note_seq=", note_seq );
}

var edit_wheelScroll = (e) => {
  scrollPosition_msec += parseInt(e.deltaY/2);
  if (scrollPosition_msec < 0)
    scrollPosition_msec = 0;
  waveformDraw.set_scrollPos(scrollPosition_msec);
  draw_editor(edit_area);
}


///////////////////////////////////////////////////////////////
//// 그 외, 잡다한 서브 함수들.
///////////////////////////////////////////////////////////////
var findNoteIndex = (start, end) => {
  let notes = song_data.notes;
  for (var i=0; i<notes.length; i++) {
    if ( (notes[i].timestamp >= start) && (notes[i].timestamp < end) ) {
        return i;
    }
  }
  return -1;
}

var shiftAllTimestampAfter = (targetIndex, offset_msec) => {
  console.log("All timestamp will be changed");
  let notes = song_data.notes;
  // let diff = (note_ts - notes[moving_note_idx].timestamp);
  for (let i = targetIndex; i< notes.length; i++) {
    notes[i].timestamp += offset_msec;  //diff;
  }
}