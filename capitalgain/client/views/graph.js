Template.graph.rendered = function() {
    console.log("rendered");
    var filepath = musicData.findOne({
        ticker: Session.get('ticker')
    }).file;
    audio = new Audio(filepath);
    generateGraph();
    console.log(graphWidth());
};


Template.graph.events({
    'click #playbutton': function() {
        console.log('play');
        if (!Session.get('playing')) {
            audio.play();
            Session.set('playing', true);
            animateGraph();
        } else {
            Session.set('playing', false);
            audio.pause();
            clearInterval(interval);
        }
    }

});

Template.graph.helpers({
    musicData: function() {
        return musicData.findOne({
            ticker: Session.get('ticker')
        });
    }

});


function generateGraph() {
    console.log("generating graph");
    datadoc = musicData.findOne({
        ticker: Session.get('ticker')
    });
    data = datadoc.musicdata;
    console.log(data);
    min = 50;
    max = 70;
    maxlength = data.length[0];
    happy = ['#081A45', '#18409E', '#7C828F', '#3B3E45', '#382E5C', '#0E453F', '#0B3B0F',
        '#0B4480', '#5C0F28', '#2F2952', '#492969', '#70215B', '#338238', '#328A88',
        '#1C857A', '#157A99', '#6C3E96', '#10A6AD', '#AD104F', '#6155E6', '#1D8539',
        '#4BD1AB', '#E7ED3B', '#3BD0ED', '#9156D1', '#5ABF1F', '#61EDE6'
    ];
    var datavis = document.getElementById("data-vis");
    var absheight = 450;
    for (var h = 0; h < data.length; h++) {
        for (var i = 0; i < data[h].length; i++) {
            for (var j = 0; j < data[h][i].length; j++) {
                //create note div with id
                //makeNote(data, i, j);
                var note = document.createElement("div");
                note.setAttribute("class", "note");
                var ypos = absheight - 11*(data[h][i][j]['pitch'] - min);
                note.style.top = ypos + 'px';
                note.style.width = 250 * (data[h][i][j]['dur']) + 'px';

                var left = 250 * (data[h][i][j]['time']);
                note.style.left = left + "px";
                
                if (h != 1) {
                    note.style.backgroundColor = happy[data[h][i][j]['+/-']];
                    note.style.borderColor = happy[data[h][i][j]['+/-']];
                    
                }
                else{
                  note.style.backgroundColor = "white";
                  note.style.borderColor = "#B5B3B5";

                }
               
                datavis.appendChild(note);
            }

        }
    }

}



function animateGraph(){
  interval = setInterval(moveGraph, 15);   
 
}

//there's probably a more elegant way to do this.
function graphWidth() {
    datadoc = musicData.findOne({
        ticker: Session.get('ticker')
    });
    //console.log(datadoc);
    data = datadoc.musicdata;
    var lastpoint = data[1][data[1].length - 1][0];
    console.log(lastpoint);
    var lasttime = lastpoint['time'];
    var lastdur = lastpoint['dur']
    return (lasttime + lastdur) * 250
}

function moveGraph() {
    var scroll = document.getElementById("data-vis");
    // var chord = document.getElementByClassName("chord"+i);
    // var fin = 0-chord.offsetLeft;
    // if(scroll.offsetLeft < fin){
    //   i++;
    //   chord.className.replace( /(?:^|\s)active(?!\S)/g , '' );
    // }
    // else if (!(chord.className.match(/(?:^|\s)active(?!\S)/))){
    //   chord.className+= "active";
    // }

    var left = scroll.offsetLeft - (10);
    scroll.style.left = left + 'px';
    //console.log(scroll.style.left);
}
