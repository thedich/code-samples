import $ from 'jquery';

export default class Player
{
    constructor(source, parent)
    {
        this.source = source;
        this.html =
            "<div class='btn_control playstop playbg'></div>" +
                "<div class='playslideholder'>" +
                    "<div class='tableplay'>" +
                        "<div class='cell'>" +
                        "<input class='playslider' type='range' value='0'>"+
                    "</div>" +
                "</div>" +
            "</div>" +
            "<div class='btn_control muteunmute mutebg'></div>" +
            "<audio id='audioplay'>" +
                "<source src='"+ this.source + "' type='audio/mpeg'>"+
            "</audio>";

        this.clparent = "." + parent;
        this.div      = "<div class='" + parent + "'></div>";
        this.range    = this.audio = null;
    }

    init()
    {
        let audio = $(this.clparent).find("#audioplay");
        this.audio = audio;

        let isPlay = false;
        let isMute = false;
        let cls    = $(this.clparent);

        $(audio).bind("timeupdate", () => { this.onTimeUpdate() });
        $(audio).bind("ended", function () {
            if( isPlay ) {
                $(cls).find(".playstop")
                    .removeClass("pausebg")
                    .addClass("playbg");
                isPlay = false;
            }
        });

        let playw = $(this.clparent).find(".playstop").width();
        let mutew = $(this.clparent).find(".muteunmute").width();
        let parentw = $(this.clparent).width();

        $(this.clparent).find('.playslider').width(parentw - playw - mutew);
        let range = $(this.clparent).find('.playslider');
        this.range = range;

        $(range).on('input', function () {

            let persrange = $(this).val();
            let duration  = audio.get(0).duration;
            let currtime  = duration*persrange/100;

            audio.get(0).currentTime = currtime;

        });

        $(this.clparent).find(".playstop").click(function () {
            $(this).empty();

            if(!isPlay) {
                $(this)
                    .removeClass("playbg")
                    .addClass("pausebg");

                isPlay = true;
                audio.trigger("play");
                return;
            }

            if(isPlay) {
                $(this)
                    .removeClass("pausebg")
                    .addClass("playbg");

                isPlay = false;
                audio.trigger("pause");
                return;
            }

        });

        $(this.clparent).find(".muteunmute").click(function () {
            $(this).empty();

            if(!isMute) {
                $(this)
                    .removeClass("mutebg")
                    .addClass("unmutebg");

                isMute = true;
                audio.prop("volume", 0);
                return;
            }

            if(isMute) {
                $(this)
                    .removeClass("unmutebg")
                    .addClass("mutebg");

                isMute = false;
                audio.prop("volume", 1);
                return;
            }
        });
    }

    onTimeUpdate()
    {
        let curtime  = this.audio.get(0).currentTime;
        let duration = this.audio.get(0).duration;
        let pers     = Math.floor((curtime/duration)*100);
        $(this.range).val(pers);
    }
}

