import $ from 'jquery';
import Player from "./components/player/Player"

$(document).ready(() => { new AppPlayer(); });
let source1 = "assets/sample.mp3";
let source2 = "assets/sample2.mp3";
let source3 = "assets/sample3.mp3";

class AppPlayer
{
    constructor(){

        let players = [];
        players.push( new Player(source1, "playholder1") );
        players.push( new Player(source2, "playholder2") );
        players.push( new Player(source3, "playholder3") );

        players.map(( el ) =>
        {
            $("body").append(el.div);
            $(el.clparent).append(el.html);
            el.init();

        });
    }
}






