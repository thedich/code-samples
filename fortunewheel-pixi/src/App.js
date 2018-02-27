import plugins from './config/plugins';
import config  from './config/config';
import Game from './game/Game';
import Sprites from './game/SpriteManager';

let game = new Game(config);
class App
{
    numInWheel = [ 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26, 0].reverse();
    speed = 2 * Math.random();
    isForceMove = false;
    isStopMOve  = false;

    constructor() { Sprites.load(this.onProgress.bind(this), this.afterLoad.bind(this)); }
    onProgress()  { console.log("spritesheet is loading...");}
    afterLoad() {

        console.log("After Load Init");
        this.fullcicle = 0;

        game.start();
        game.stage.addChild(Sprites.Weel);
        game.stage.addChild(Sprites.Stopper);
        game.stage.addChild(Sprites.ButtonStart.conteiner);
        game.stage.addChild(Sprites.ButtonStop.conteiner);
        game.stage.addChild(Sprites.TextNum);

        Sprites.TextNum.position.x = 30;
        Sprites.TextNum.position.y = Sprites.ButtonStop.conteiner.height*2 + 30;

        Sprites.ButtonStop.conteiner.position.y = Sprites.ButtonStop.conteiner.height + 20;
        Sprites.ButtonStop.setDisable(true);

        Sprites.ButtonStart.onclick = () => {
            if( !Sprites.ButtonStart.isDisabled )
            {
                Sprites.ButtonStart.setDisable(true);
                Sprites.ButtonStop.setDisable(false);
                this.isStopMOve = false;
                this.isForceMove = true;
                this.fullcicle = 1;
            }
        };

        Sprites.ButtonStop.onclick = () => {
            if( !Sprites.ButtonStop.isDisabled )
            {
                Sprites.ButtonStop.setDisable(true);
                this.isForceMove = false;
                this.isStopMOve = true;
            }
        };



        window.addEventListener("resize", () => {
            this.onResize();
        }); this.setAling();

        Game.updateDelta = this.update.bind(this);
        this.getNumByAngle();
    }

    onResize()
    {
        console.log("resize callback");
        this.setAling();
    }

    setAling()
    {
        Sprites.Weel.position.set(window.innerWidth/2, window.innerHeight/2 + 30);
        Sprites.Stopper.position.set(window.innerWidth/2, Sprites.Stopper.height/2);
    }

    update( delta )
    {
        let rot = Sprites.Weel.rotation*180/Math.PI;
        if( rot > 359 ) this.fullcicle++;
        while( rot > 360 ) { rot -= 360 };
        let round = Math.floor(rot/10)*10;

        if( this.isForceMove )
        {
            Sprites.Weel.rotation += delta * this.speed;

            if(  this.speed < 3 ) this.speed += 0.01;
            else this.speed = 3;

        }

        if( this.isStopMOve )
        {
            Sprites.Weel.rotation += delta * this.speed;
            if(  this.speed > 0 ) this.speed -= 0.01;
            else {
                this.speed = 0;
                Sprites.ButtonStart.setDisable(false);

                let numIs = '' + this.getNumByAngle(round);
                Sprites.TextNum.text = numIs;
            }
        }

        let indexOfRotation = rot * 37/360;
        let indexROT = Math.floor(indexOfRotation);

        // console.log("index rotation: " + indexROT);
        // console.log("num in wheel: " + this.numInWheel[indexROT]);

        // console.log("rotation: " + rot);
        // console.log("round: "    + round);
        // console.log("fullcicle: " + this.fullcicle);
    }

    getNumByAngle( num )
    {
        let angleMap = {
                "360" : 0,
                "350": 32,
                "340": 15,
                "330": 19,
                "320": 4,
                "310": 21,
                "300": 2,
                "290": 25,
                "280": 17,
                "270": 34,
                "260": 6,
                "250": 27,
                "240": 13,
                "230": 36,
                "220": 11,
                "210": 30,
                "200": 8,
                "190": 23,
                "180": 10,
                "170": 5,
                "160": 24,
                "150": 16,
                "140": 33,
                "130": 1,
                "120": 20,
                "110": 14,
                "100": 31,
                "90": 9,
                "80": 22,
                "70": 18,
                "60": 29,
                "50": 7,
                "40": 28,
                "30": 12,
                "20": 35,
                "10": 3,
                "0": 26,

            };
        return angleMap['' + num + ''];
    }

} new App();


