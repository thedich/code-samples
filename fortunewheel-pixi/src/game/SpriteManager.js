import PIXI from 'pixi.js';

export default class SpriteManager {

  static ButtonStart;
  static ButtonStop;
  static Weel;
  static Stopper;
  static TextNum;

  constructor() {}
  static load(onProgress, afterLoad)
  {
      PIXI.loader
          .add("./assets/spritesheet-1.json")
          .on("progress", onProgress)
          .load(function (loader, resources) {

              let tex;
              tex = PIXI.utils.TextureCache["stopper.png"];
              let sp = new PIXI.Sprite(tex);
              sp.anchor.set(0.5);
              SpriteManager.Stopper = sp;

              tex = PIXI.utils.TextureCache["wheel.png"];
              let sprite = new PIXI.Sprite(tex);
              sprite.anchor.set(0.5);
              SpriteManager.Weel = sprite;

              SpriteManager.ButtonStart = new Button("Start");
              SpriteManager.ButtonStop = new Button("Stop");

              let textnum = new PIXI.Text( '' , {
                  fontSize : 36,
                  fontFamily: 'Arial',
                  fill : 0xffffff
              });

              SpriteManager.TextNum = textnum;

              if( afterLoad ) afterLoad();
      });
  }

}

class Button
{
    constructor( name )
    {
        this.onclick = null;
        this.isDisabled = false;
        this.conteiner = new PIXI.Container();
        let tex;

        tex = PIXI.utils.TextureCache["button_white_release.png"];
        this.normal = new PIXI.Sprite(tex);

        tex = PIXI.utils.TextureCache["button_white_press.png"];
        this.press = new PIXI.Sprite(tex);

        tex = PIXI.utils.TextureCache["button_white_over.png"];
        this.over = new PIXI.Sprite(tex);

        tex = PIXI.utils.TextureCache["button_white_disable.png"];
        this.disable = new PIXI.Sprite(tex);


        this.text = new PIXI.Text( name, {
            fontSize : 36,
            fontFamily: 'Arial',
            fill : 0xffffff
            });


        this.disable.name = "disable";
        this.normal.name  = "normal";
        this.over.name    = "over";
        this.press.name   = "press";

        this.conteiner.addChild(this.disable);
        this.conteiner.addChild(this.press);
        this.conteiner.addChild(this.over);
        this.conteiner.addChild(this.normal);
        this.conteiner.addChild(this.text);

        this.text.position.x = (this.normal.width - this.text.width)/2;
        this.text.position.y = (this.normal.height - this.text.height)/2;

        this.conteiner.interactive = true;
        this.conteiner.buttonMode = true;

        this.conteiner.mouseover = () => { this.swapInContainer(this.over);   }
        this.conteiner.mouseout  = () => { this.swapInContainer(this.normal); }
        this.conteiner.mousedown = () => { this.swapInContainer(this.press);  }
        this.conteiner.mouseup   = () => { this.swapInContainer(this.over);   }
        this.conteiner.click     = () => { if( this.onclick ) this.onclick(); }
    }

    setDisable( boo )
    {
        this.isDisabled = boo;
        if( this.isDisabled )
        {
            this.swapInContainer(this.disable);
            this.conteiner.interactive = false;
            this.conteiner.buttonMode = false;

        } else
        {
            this.swapInContainer( this.normal );
            this.conteiner.interactive = true;
            this.conteiner.buttonMode  = true;
        }
    }

    swapInContainer( chone )
    {
        let len = this.conteiner.children.length;
        let choneIdx;

        for ( let i =0; i<this.conteiner.children.length; i++)
        {
            let child = this.conteiner.children[i];
            if( child.name == chone.name ) choneIdx = this.conteiner.children[i];

        }
        this.conteiner.swapChildren(this.conteiner.children[ len - 2 ], choneIdx);
    }
}
