/*    Ukulele Chord icon table - 
*/

var chord_name = [  
    "C", 
    "Cm", 
    "C7",
    "Cmaj7",
    "Cm7",
    "Cdim",
    "Cm7b5",
    "Caug",
    "Csus4",
    "C6",
    "C9",
    "Cmaj9",
    "Cmmaj7",
    "Cadd9",

    "C#", 
    "C#m", 
    "C#7",
    "C#maj7",
    "C#m7",
    "C#dim",
    "C#m7b5",
    "C#aug",
    "C#sus4",
    "C#6",
    "C#9",
    "C#maj9",
    "C#mmaj7",
    "C#add9",

    "D", 
    "Dm", 
    "D7",
    "Dmaj7",
    "Dm7",
    "Ddim",
    "Dm7b5",
    "Daug",
    "Dsus4",
    "D6",
    "D9",
    "Dmaj9",
    "Dmmaj7",
    "Dadd9",

    "D#", 
    "D#m", 
    "D#7",
    "D#maj7",
    "D#m7",
    "D#dim",
    "D#m7b5",
    "D#aug",
    "D#sus4",
    "D#6",
    "D#9",
    "D#maj9",
    "D#mmaj7",
    "D#add9",

    "E", 
    "Em", 
    "E7",
    "Emaj7",
    "Em7",
    "Edim",
    "Em7b5",
    "Eaug",
    "Esus4",
    "E6",
    "E9",
    "Emaj9",
    "Emmaj7",
    "Eadd9",

    "F", 
    "Fm", 
    "F7",
    "Fmaj7",
    "Fm7",
    "Fdim",
    "Fm7b5",
    "Faug",
    "Fsus4",
    "F6",
    "F9",
    "Fmaj9",
    "Fmmaj7",
    "Fadd9",

    "F#", 
    "F#m", 
    "F#7",
    "F#maj7",
    "F#m7",
    "F#dim",
    "F#m7b5",
    "F#aug",
    "F#sus4",
    "F#6",
    "F#9",
    "F#maj9",
    "F#mmaj7",
    "F#add9",

    "G", 
    "Gm", 
    "G7",
    "Gmaj7",
    "Gm7",
    "Gdim",
    "Gm7b5",
    "Gaug",
    "Gsus4",
    "G6",
    "G9",
    "Gmaj9",
    "Gmmaj7",
    "Gadd9",

    "G#", 
    "G#m", 
    "G#7",
    "G#maj7",
    "G#m7",
    "G#dim",
    "G#m7b5",
    "G#aug",
    "G#sus4",
    "G#6",
    "G#9",
    "G#maj9",
    "G#mmaj7",
    "G#add9",

    "A", 
    "Am", 
    "A7",
    "Amaj7",
    "Am7",
    "Adim",
    "Am7b5",
    "Aaug",
    "Asus4",
    "A6",
    "A9",
    "Amaj9",
    "Ammaj7",
    "Aadd9",

    "A#", 
    "A#m", 
    "A#7",
    "A#maj7",
    "A#m7",
    "A#dim",
    "A#m7b5",
    "A#aug",
    "A#sus4",
    "A#6",
    "A#9",
    "A#maj9",
    "A#mmaj7",
    "A#add9",

    "B", 
    "Bm", 
    "B7",
    "Bmaj7",
    "Bm7",
    "Bdim",
    "Bm7b5",
    "Baug",
    "Bsus4",
    "B6",
    "B9",
    "Bmaj9",
    "Bmmaj7",
    "Badd9",
];

var finger_icon_info = [            // xpos = 0, 9, 21, 32, 41...   
    { "a":32, "e":0 , "c":0 , "g":0   },        //     "C", 
    { "a":32, "e":32, "c":32, "g":0   },        //     "Cm", 
    { "a":9 , "e":0 , "c":0 , "g":0   },        //     "C7",
    { "a":21, "e":0 , "c":0 , "g":0   },        //     "Cmaj7",
    { "a":32, "e":32, "c":32, "g":32  },        //     "Cm7",
    { "a":32, "e":21, "c":32, "g":21  },        //     "Cdim",
    { "a":32, "e":21, "c":32, "g":32  },        //     "Cm7b5",
    { "a":32, "e":0 , "c":0 , "g":9   },        //     "Caug",
    { "a":32, "e":9 , "c":0 , "g":0   },        //     "Csus4",
    { "a":0 , "e":0 , "c":0 , "g":0   },        //     "C6",
    { "a":9 , "e":0 , "c":21, "g":0   },        //     "C9",
    { "a":21, "e":0 , "c":21, "g":0   },        //     "Cmaj9",
    { "a":32, "e":32, "c":32, "g":41  },        //     "Cmmaj7",
    { "a":51, "e":0 , "c":0 , "g":0   },        //     "Cadd9",     **

    { "a":41, "e":9 , "c":9 , "g":9   },        //     "C#", 
    { "a":9 , "e":9 , "c":9 , "g":32  },        //     "C#m", 
    { "a":21, "e":9 , "c":9 , "g":9   },        //     "C#7",
    { "a":32, "e":9 , "c":9 , "g":9   },        //     "C#maj7",
    { "a":21, "e":0 , "c":9 , "g":9   },        //     "C#m7",
    { "a":9 , "e":0 , "c":9 , "g":0   },        //     "C#dim",
    { "a":21, "e":0 , "c":9 , "g":0   },        //     "C#m7b5",
    { "a":0 , "e":9 , "c":9 , "g":21  },        //     "C#aug",
    { "a":41, "e":41, "c":60, "g":60  },        //     "C#sus4",    **
    { "a":9 , "e":9 , "c":9 , "g":9   },        //     "C#6",
    { "a":21, "e":9 , "c":32, "g":9   },        //     "C#9",
    { "a":32, "e":9 , "c":32, "g":9   },        //     "C#maj9",
    { "a":32, "e":0 , "c":9 , "g":9   },        //     "C#mmaj7",
    { "a":41, "e":9 , "c":32, "g":9   },        //     "C#add9",

    { "a":0 , "e":21, "c":21, "g":21  },        //     "D", 
    { "a":0 , "e":9 , "c":21, "g":21  },        //     "Dm", 
    { "a":32, "e":21, "c":21, "g":21  },        //     "D7",
    { "a":41, "e":21, "c":21, "g":21  },        //     "Dmaj7",
    { "a":32, "e":9 , "c":21, "g":21  },        //     "Dm7",
    { "a":21, "e":9 , "c":21, "g":9   },        //     "Ddim",
    { "a":32, "e":9 , "c":21, "g":9   },        //     "Dm7b5",
    { "a":9 , "e":21, "c":21, "g":32  },        //     "Daug",
    { "a":0 , "e":32, "c":21, "g":21  },        //     "Dsus4",
    { "a":21, "e":21, "c":21, "g":21  },        //     "D6",
    { "a":32, "e":21, "c":41, "g":21  },        //     "D9",
    { "a":41, "e":21, "c":41, "g":21  },        //     "Dmaj9",
    { "a":41, "e":9 , "c":21, "g":21  },        //     "Dmmaj7",
    { "a":51, "e":21, "c":41, "g":21  },        //     "Dadd9",     **

    { "a":9 , "e":32, "c":32, "g":0   },        //     "D#", 
    { "a":9 , "e":21, "c":32, "g":32  },        //     "D#m", 
    { "a":41, "e":32, "c":32, "g":32  },        //     "D#7",       **
    { "a":51, "e":32, "c":32, "g":32  },        //     "D#maj7",    **
    { "a":41, "e":21, "c":32, "g":32  },        //     "D#m7",
    { "a":32, "e":21, "c":32, "g":21  },        //     "D#dim",
    { "a":41, "e":21, "c":32, "g":21  },        //     "D#m7b5",
    { "a":21, "e":32, "c":32, "g":0   },        //     "D#aug",
    { "a":9 , "e":41, "c":32, "g":32  },        //     "D#sus4",
    { "a":32, "e":32, "c":32, "g":32  },        //     "D#6",       **
    { "a":9 , "e":9 , "c":9 , "g":0   },        //     "D#9",
    { "a":9 , "e":9 , "c":21, "g":0   },        //     "D#maj9",
    { "a":51, "e":21, "c":32, "g":32  },        //     "D#mmaj7",   **
    { "a":9 , "e":9 , "c":32, "g":0   },        //     "D#add9",

    { "a":21, "e":41, "c":41, "g":41  },        //     "E", 
    { "a":21, "e":32, "c":41, "g":0   },        //     "Em", 
    { "a":21, "e":0 , "c":21, "g":9   },        //     "E7",
    { "a":21, "e":41, "c":32, "g":41  },        //     "Emaj7",
    { "a":21, "e":0 , "c":21, "g":0   },        //     "Em7",
    { "a":9 , "e":0 , "c":9 , "g":0   },        //     "Edim",
    { "a":9 , "e":0 , "c":21, "g":0   },        //     "Em7b5",
    { "a":41, "e":0 , "c":0 , "g":9   },        //     "Eaug",
    { "a":21, "e":51, "c":41, "g":41  },        //     "Esus4",     **
    { "a":21, "e":0 , "c":9 , "g":9   },        //     "E6",
    { "a":21, "e":21, "c":21, "g":9   },        //     "E9",
    { "a":21, "e":21, "c":32, "g":9   },        //     "Emaj9",
    { "a":21, "e":0 , "c":32, "g":0   },        //     "Emmaj7",
    { "a":21, "e":21, "c":41, "g":41  },        //     "Eadd9",  

    { "a":0 , "e":9 , "c":0 , "g":21  },        //     "F", 
    { "a":32, "e":9 , "c":0 , "g":9   },        //     "Fm", 
    { "a":32, "e":9 , "c":32, "g":21  },        //     "F7",
    { "a":0 , "e":0 , "c":51, "g":51  },        //     "Fmaj7",     **
    { "a":32, "e":9 , "c":32, "g":9   },        //     "Fm7",
    { "a":21, "e":9 , "c":21, "g":9   },        //     "Fdim",
    { "a":21, "e":9 , "c":32, "g":9   },        //     "Fm7b5",
    { "a":0 , "e":9 , "c":9 , "g":21  },        //     "Faug",
    { "a":9 , "e":9 , "c":0 , "g":32  },        //     "Fsus4",    
    { "a":32, "e":9 , "c":21, "g":21  },        //     "F6",
    { "a":32, "e":32, "c":32, "g":21  },        //     "F9",
    { "a":0 , "e":0 , "c":0 , "g":0   },        //     "Fmaj9",
    { "a":32, "e":9 , "c":41, "g":9   },        //     "Fmmaj7",
    { "a":0 , "e":9 , "c":0 , "g":0   },        //     "Fadd9",  

    { "a":9 , "e":21, "c":9 , "g":32  },        //     "F#", 
    { "a":0 , "e":21, "c":9 , "g":21  },        //     "F#m", 
    { "a":41, "e":21, "c":41, "g":32  },        //     "F#7",       
    { "a":41, "e":60, "c":51, "g":60  },        //     "F#maj7",    **
    { "a":41, "e":21, "c":41, "g":21  },        //     "F#m7",
    { "a":32, "e":21, "c":32, "g":21  },        //     "F#dim",
    { "a":32, "e":21, "c":41, "g":21  },        //     "F#m7b5",
    { "a":9 , "e":21, "c":21, "g":32  },        //     "F#aug",
    { "a":41, "e":68, "c":59, "g":59  },        //     "F#sus4",    **
    { "a":42, "e":21, "c":32, "g":32  },        //     "F#6",       
    { "a":41, "e":41, "c":41, "g":32  },        //     "F#9",
    { "a":9 , "e":9 , "c":9 , "g":9   },        //     "F#maj9",
    { "a":41, "e":21, "c":51, "g":21  },        //     "F#mmaj7",   **
    { "a":9 , "e":21, "c":9 , "g":9   },        //     "F#add9",

    { "a":21, "e":32, "c":21, "g":0   },        //     "G", 
    { "a":9 , "e":32, "c":21, "g":0   },        //     "Gm", 
    { "a":21, "e":9 , "c":21, "g":0   },        //     "G7",
    { "a":21, "e":21, "c":21, "g":0   },        //     "Gmaj7",    
    { "a":9 , "e":9 , "c":21, "g":0   },        //     "Gm7",
    { "a":9 , "e":0 , "c":9 , "g":0   },        //     "Gdim",
    { "a":9 , "e":9 , "c":9 , "g":0   },        //     "Gm7b5",
    { "a":21, "e":32, "c":32, "g":0   },        //     "Gaug",
    { "a":32, "e":32, "c":21, "g":0   },        //     "Gsus4",    
    { "a":21, "e":0 , "c":21, "g":0   },        //     "G6",
    { "a":21, "e":9 , "c":21, "g":21  },        //     "G9",
    { "a":21, "e":21, "c":21, "g":21  },        //     "Gmaj9",
    { "a":9 , "e":21, "c":21, "g":0   },        //     "Gmmaj7",
    { "a":21, "e":32, "c":21, "g":21  },        //     "Gadd9",  

    { "a":32, "e":41, "c":32, "g":50  },        //     "G#",        **
    { "a":21, "e":41, "c":32, "g":9   },        //     "G#m", 
    { "a":32, "e":21, "c":32, "g":9   },        //     "G#7",       
    { "a":32, "e":32, "c":32, "g":9   },        //     "G#maj7",   
    { "a":21, "e":21, "c":32, "g":9   },        //     "G#m7",
    { "a":21, "e":9 , "c":21, "g":9   },        //     "G#dim",
    { "a":21, "e":21, "c":21, "g":9   },        //     "G#m7b5",
    { "a":32, "e":0 , "c":0 , "g":9   },        //     "G#aug",
    { "a":41, "e":41, "c":32, "g":9   },        //     "G#sus4",    
    { "a":32, "e":9 , "c":32, "g":9   },        //     "G#6",       
    { "a":32, "e":21, "c":32, "g":32  },        //     "G#9",
    { "a":32, "e":32, "c":32, "g":32  },        //     "G#maj9",
    { "a":21, "e":32, "c":32, "g":9   },        //     "G#mmaj7",   
    { "a":32, "e":41, "c":32, "g":32  },        //     "G#add9",

    { "a":0 , "e":0 , "c":9 , "g":21  },        //     "A", 
    { "a":0 , "e":0 , "c":0 , "g":21  },        //     "Am", 
    { "a":0 , "e":0 , "c":9 , "g":0   },        //     "A7",
    { "a":0 , "e":0 , "c":9 , "g":9   },        //     "Amaj7",    
    { "a":0 , "e":0 , "c":0 , "g":0   },        //     "Am7",
    { "a":32, "e":21, "c":32, "g":21  },        //     "Adim",
    { "a":32, "e":32, "c":32, "g":21  },        //     "Am7b5",
    { "a":0 , "e":9 , "c":9 , "g":21  },        //     "Aaug",
    { "a":0 , "e":0 , "c":21, "g":21  },        //     "Asus4",    
    { "a":41, "e":21, "c":41, "g":21  },        //     "A6",
    { "a":21, "e":0 , "c":9 , "g":0   },        //     "A9",
    { "a":21, "e":0 , "c":9 , "g":9   },        //     "Amaj9",
    { "a":0 , "e":0 , "c":0 , "g":9   },        //     "Ammaj7",
    { "a":21, "e":0 , "c":9 , "g":21  },        //     "Aadd9",  

    { "a":9 , "e":9 , "c":21, "g":32  },        //     "A#",       
    { "a":9 , "e":9 , "c":9 , "g":32  },        //     "A#m", 
    { "a":9 , "e":9 , "c":21, "g":9   },        //     "A#7",       
    { "a":0 , "e":9 , "c":21, "g":32  },        //     "A#maj7",   
    { "a":9 , "e":9 , "c":9 , "g":9   },        //     "A#m7",
    { "a":9 , "e":0 , "c":9 , "g":0   },        //     "A#dim",
    { "a":9 , "e":0 , "c":9 , "g":9   },        //     "A#m7b5",
    { "a":9 , "e":21, "c":21, "g":32  },        //     "A#aug",
    { "a":9 , "e":9 , "c":32, "g":32  },        //     "A#sus4",    
    { "a":9 , "e":9 , "c":21, "g":0   },        //     "A#6",       
    { "a":32, "e":9 , "c":21, "g":9   },        //     "A#9",
    { "a":32, "e":9 , "c":21, "g":21  },        //     "A#maj9",
    { "a":9 , "e":9 , "c":9 , "g":21  },        //     "A#mmaj7",   
    { "a":32, "e":9 , "c":21, "g":32  },        //     "A#add9",

    { "a":21, "e":21, "c":32, "g":41  },        //     "B", 
    { "a":21, "e":21, "c":21, "g":41  },        //     "Bm", 
    { "a":21, "e":21, "c":32, "g":21  },        //     "B7",
    { "a":9 , "e":21, "c":32, "g":41  },        //     "Bmaj7",    
    { "a":21, "e":21, "c":21, "g":21  },        //     "Bm7",
    { "a":21, "e":9 , "c":21, "g":9   },        //     "Bdim",
    { "a":21, "e":9 , "c":21, "g":21  },        //     "Bm7b5",
    { "a":21, "e":32, "c":32, "g":41  },        //     "Baug",
    { "a":21, "e":21, "c":41, "g":41  },        //     "Bsus4",    
    { "a":21, "e":21, "c":32, "g":9   },        //     "B6",
    { "a":41, "e":21, "c":32, "g":21  },        //     "B9",
    { "a":41, "e":21, "c":32, "g":32  },        //     "Bmaj9",
    { "a":21, "e":21, "c":21, "g":32  },        //     "Bmmaj7",
    { "a":41, "e":21, "c":32, "g":41  },        //     "Badd9",  
];


window.onload = function main() {

    var cnvs = document.getElementsByClassName("chordicon");
    console.log( "number of canvas = " + cnvs.length );
    for (i=0; i<cnvs.length; i++) {
        cnvs[i].width = 50; cnvs[i].height = 54;
        var ctx = cnvs[i].getContext("2d");
        console.log("icons = " + finger_icon_info[i].g + "w="+cnvs[i].width+",h="+cnvs[i].height );
        draw_chord_icon(ctx, chord_name[i], finger_icon_info[i] );
    }

    var total_cnvs = document.getElementById("whole_chords");
    var total_ctx = total_cnvs.getContext("2d");
    total_cnvs.width = 700; total_cnvs.height = 648;
    for (i=0; i<cnvs.length; i++) {
        total_ctx.drawImage(cnvs[i], (i%14)*50, parseInt(i/14)*54 );
    }
}
  

var draw_chord_icon = function(ctx, name, finger) { 
    ctx.textBaseline = 'top';
    ctx.font = 'bold 16px "Palatino Linotype"';             // '16px "Goudy Old Style"';        // 
    ctx.fontWeight = '900';
    ctx.fillStyle = "rgba( 0, 0, 0, 0.0)";
    ctx.clearRect(0, 0, ctx.canvas_width, ctx.canvas_height);

    console.log("inside function = " + finger.toString() );

    ctx.strokeStyle = "rgb(48,48,48)";
    ctx.beginPath();
    // At first, drawing lines for ukulele.
    ctx.moveTo(0,8);    ctx.lineTo(50,8);
    ctx.moveTo(0,16);    ctx.lineTo(50,16);
    ctx.moveTo(0,24);    ctx.lineTo(50,24);
    ctx.moveTo(0,32);    ctx.lineTo(50,32);

    ctx.moveTo(0,8);    ctx.lineTo(0,32);
    ctx.moveTo(1,8);    ctx.lineTo(1,32);
    ctx.moveTo(2,8);    ctx.lineTo(2,32);
    ctx.moveTo(13,8);    ctx.lineTo(13,32);
    ctx.moveTo(25,8);    ctx.lineTo(25,32);
    ctx.moveTo(36,8);    ctx.lineTo(36,32);
    ctx.moveTo(45,8);    ctx.lineTo(45,32);
    ctx.stroke(); 

    ctx.fillStyle = 'black';
    ctx.beginPath();
    if (finger.a != 0) {
        ctx.arc( finger.a, 8 , 3,   0, 2 * Math.PI);
    }
    ctx.fill(); 
    ctx.beginPath();
    if (finger.e != 0) {
        ctx.arc( finger.e, 16, 3,   0, 2 * Math.PI);
    }
    ctx.fill(); 
    ctx.beginPath();
    if (finger.c != 0) {
        ctx.arc( finger.c, 24, 3,   0, 2 * Math.PI);
    }
    ctx.fill(); 
    ctx.beginPath();
    if (finger.g != 0) {
        ctx.arc( finger.g, 32, 3,   0, 2 * Math.PI);
    }
    ctx.fill(); 

    ctx.fillText( name, 4, 38);
}

