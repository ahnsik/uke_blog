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
    focus_msec: 0,      // 커서 포커스가 위치하는 timeline.
    focused_line: "",
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
    init(),
    drawWave(ctx),
    drawBg(ctx),
    drawNotes(ctx, json_data),
    drawRuler(ctx),
    set_audioBuffer(buf, samplerate),
    set_windowSize(x, y, w, h),
    set_focusPos(offset),
    get_focusPos_msec(),
    set_scrollPos(offset),
    get_scrollPos(),
    set_startOffset(offset),
    get_startOffset(),
    set_playingPosition(pos),
    set_quaverSize(note_size),
    get_msecPerGrid(),
    set_wordSize(word_size),
    set_semiQuaver(semi),
    zoom_in(),
    zoom_out(),
    set_scaleFactor(factor),
    get_msecPerPixel(),
    set_focusCategory(focus_line),
    get_clickedCategory(ypos),
    get_clickedTimeStamp(xpos),
};








const AUTOSCROLL_LEFT_LIMIT = 2000;
const song_list = [];
const host_url = "http://ccash2.gonetis.com:88";
const file_list = [];

const START_XPOS = 0;     // ??
const MINIMUM_WAVE_SIZE = 120;

/////// about Editor resize & UKE_Document
var initialSelect = 0;
var array_l = [];     // wav buffer
var canvas_width, canvas_height;

var scrollPosition_msec = 0;

window.onload = function main() {
}

function getParameterByName(name) {
}

window.addEventListener("resize", window_resized);
function window_resized(event) {
}

let edit_area = document.getElementById("waveformCanvas");

function resize_canvas(cnvs_width, cnvs_height) {
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
}

//// MP3 데이터를 디코딩 하여 array_l 버퍼에 저장.
async function mp3Decode(mp3Buffer) {
}

///////////////////////////////////////////////////////////////
//// 편집화면영역(waveform, TAB, etc..)을 Drawing
///////////////////////////////////////////////////////////////
var draw_editor = (canvas) => {
}

/* canvas width 에 맞춰서 pixel 별로, 해당 pixel (xpos)에 해당하는 msec 값을 구한 다음에, 
   해당 msec 를 기준으로 모든 것을 판단하고 drawing 하도록 한다. 
*/
var play_handler = null;
var speed_multiplier = 1.0;

var play_song = () => {
};

var stop_song = () => {
}

var goto_head = () => {
}

var rewind_10sec = () => {
}

var change_speed = (speed) => {
}

var zoom_in = function () {
}
var zoom_out = function () {
}
var fullWave = function () {
}
var halfWave = function () {
}

var calc_note_size = () => {   // samplesPerPixel, zoomFactor 등을 계산
}

var quaver_changed = () => {
}
var bpm_changed = () => {
}
var offset_changed = () => {
}
var signature_changed = () => {
}

var last_posX=0, last_posY=0;
var last_timeStamp = 0;
var scroll_x = 0, prev_position=0;
// var click_pos = null;
var isDragging = false;
var isScrollMode = false;

var edit_keyDown = (e) => {
}
var edit_keyUp = (e) => {
}

var edit_mouseDown = (e) => {
}
var edit_mouseMove = (e) => {
}
var edit_mouseUp = (e) => {
}

var edit_mouseDblClick = (e) => {
}

var edit_wheelScroll = (e) => {
}

var findNoteIndex = (start, end) => {
}
