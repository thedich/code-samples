import { Fly } from "./flytable/FlyTable";

export class FlightManager {
    private _list:{[key: string]: Fly} = {};

    constructor() {}
    private static _instance:FlightManager;
    static getInstance(){
        if ( !this._instance )
        {
            this._instance = new FlightManager();
            return this._instance;
        }   return this._instance;
    }

    addUpdateList(fly:Fly)
    {
        if ( !this._list.hasOwnProperty( fly.id ) )
        {
            console.log('add new flight to list');
            this._list[ fly.id ] = fly;
        } else {
            console.log('update flight in list');
            this._list[ fly.id ].copyFrom(fly);
        }
    }

    getFlyList()
    {
       let res:Fly[] = [];
       Object.keys(this._list).map((key) => {
           res.push( this._list[ key ]);
       });

       return res;
    }

}

