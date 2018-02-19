import React = require('react');
import {Head} from 'flytable/head/Head';
import {FlyRows} from 'flytable/flyrow/FlyRows';
import {FlightManager} from "../FlightManager";

interface FlyTableProps { flydata:Fly[]}
interface FlyTableState { flydata: Fly[]}

const Path:string     = 'https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=56.84,55.27,33.48,41.48';
const PathInfo:string = 'https://data-live.flightradar24.com/clickhandler/?version=1.5&flight='; // + board id
const nameMap         = [ 'mode S', 'lat'    , 'lon'    , '??', '??'   , 'скорость (km/ч)',  'высота (м)', '??'     , 'Тип самолета', '??'   , '??'      , 'прилет' , 'вылет', '??' , '??' , '??' , '??'  , '??', 'удаленнось от домодедово'];


const filterSign      = "??";

export interface ServerFlyFormat {
    0: string;
    1: string
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    13: string;
    14: string;
    15: string;
    16: string;
    17: string;

}

export interface ColumnNames
{
    modes:     string,
    latitude:  string,
    longitude: string,
    speed:     string,
    hight:     string,
    flytype:   string,
    flyfrom:   string,
    flyto:     string,
    distance:  string
}

export class Fly {
    private _raw: ServerFlyFormat;
    private _id:string;

    constructor (serverData: ServerFlyFormat, id:string) {
        this._raw = serverData;
        this._id = id;
    }

    public copyFrom(from: Fly) {
        this._raw = from._raw;
    }

    get hash(): string {
        return String(this.latitude) + '|' + String(this.longitude) + '|' + String(this.speed) + '|' +String(this.hight);
        //return String(this.speed);
    }

    private getDistance(lat:number, lon:number)
    {
        const domvo = { lat: 55.410307, lon: 37.902451 };
        const distance = Math.acos(Math.sin(domvo.lat)* Math.sin(lat) + Math.cos(domvo.lat)*Math.cos(lat)*Math.cos(domvo.lon - lon))*6371;
        return Math.round(distance);
    }
    
    private reEmpty(str:string)
    {
        return str == '' ? str = "---" : str;
    }

    get modes():string {
        return this.reEmpty( this._raw[0] );
    }

    get latitude(): string {
        return this.reEmpty( this._raw[1]);
    }

    get longitude(): string {
        return this.reEmpty( this._raw[2]);
    }

    get speed(): string {
        return this.reEmpty( this._raw[3]);
    }

    get hight(): string {
        return this.reEmpty( this._raw[6]);
    }

    get flytype(): string {
        return this.reEmpty( this._raw[8]);
    }

    get flyfrom(): string {
        return this.reEmpty( this._raw[11]);
    }

    get flyto(): string {
        return this.reEmpty( this._raw[12] );
    }

    get distance(): number {
        return this.getDistance( +this.latitude, +this.longitude);
    }

    get id():string
    {
        return this._id;
    }

    static columnNames(): ColumnNames {
        return {
            modes:     'Код рейса',
            latitude:  'Долгота' ,
            longitude: 'Широта',
            speed:     'Скорость (km/ч)',
            hight:     'Высота (м)',
            flytype:   'Тип самолета',
            flyfrom:   'Вылет',
            flyto:     'Прилет',
            distance:  'Удаленнось от Домодедово'
        };
    }

}


export class FlyTable extends React.Component<FlyTableProps, FlyTableState>
{
    static nameMap = nameMap;
    static infoFlyPath:string = PathInfo;
    
    private _interval: number;
    private _isSortByDistance:boolean = false;
    private _unsort:Fly[];

	constructor(props: FlyTableProps)
	{
		super(props);
		this.state = { flydata: [] };
	}

	componentDidMount()
	{
	    this.getDataFly();

		this._interval = window.setInterval(()=> {
		    this.getDataFly();
        }, 1000);
	}

	componentWillUnmount()
    {
        clearInterval(this._interval);
    }

	getDataFly()
    {
	    FlyTable.getFlyData( Path ).then((data:any) => {
            const pdata = this.prepareData(data);

            //console.log("fly data: " + JSON.stringify(pdata));

            if( this._isSortByDistance ){
	            //this.setState({ flydata: pdata });
	            this.headDistanceClick(true, pdata);
                return;
           }

            this.setState({
                flydata: pdata
            });
        });
    }

	prepareData(data:any): Fly[]
    {
        let jsondata;
        if( typeof data === "object" && data !== null )
            jsondata = data;
        else
            jsondata = JSON.parse(data) || null;

        if ( !jsondata ) return;

        let flys: Fly[] = [];

        for ( let key in jsondata )
            if( Array.isArray( jsondata[key] ))
            {
                let arr = jsondata[key];
                let fly = new Fly(arr, key );
                flys.push(fly);

               FlightManager.getInstance().addUpdateList(fly);
            }

        return flys;
    }

	static getFlyData( path: string, onComplete?: (data: ServerFlyFormat) => void )
	{
        let response = 'callback';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.send();

        let remcall:any;
        function then( callback:any ) {
            remcall = callback;
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                console.log( xhr.status + ': ' + xhr.statusText );
            } else {
                response = xhr.responseText;
                remcall(response);
                onComplete && onComplete(JSON.parse(response));
            }
        };

        return { then:then };
	};

	headDistanceClick( needSort:boolean, flys?:Fly[])
    {
        if(needSort)
        {
	        let sorted: Fly[];
            if ( flys )  this._unsort = flys;
            else this._unsort = this.state.flydata.slice();
            
            if ( flys )
                 sorted= flys;
            else sorted= this.state.flydata;
            
            sorted = sorted.sort(function (a, b) {
                return a.distance - b.distance;
            });

            this.setState({flydata: sorted});
            this._isSortByDistance = true;
            return;
        }

        if(!needSort )
        {
            this.setState({flydata: this._unsort });
            this._isSortByDistance = false;
            return;
        }

    }


	render(): JSX.Element
	{
        return (
            <div className="flytable">
                <Head onClick={ this.headDistanceClick.bind(this) }/>
                <FlyRows rowData={ this.state.flydata }></FlyRows>
            </div>
        );
	}
}