import React = require('react');
import classNames = require('classnames');
import { ITreeData, TreeList } from "./components/TreeList";

interface CustomTreeData extends ITreeData
{
    id:number;
    name:string;
    children?:CustomTreeData[]
}

let data = {
    "id":1,
    "name":"Root of Tree",
    "children":[
        {
            "id":11,
            "name": "Dereck Dore"
        },
        {
            "id":22,
            "name":"Company",
            "children":[
                {
                    "id":221,
                    "name": "Sandra Cole"
                },
                {
                    "id":222,
                    "name": "Manuel	Floyd"
                },
                {
                    "id":223,
                    "name": "Aaron Banks"
                }
            ]
        },
        {
            "id":33,
            "name": "Natasha Ryan"
        },
        {
            "id":44,
            "name": "Wallace Edwards"
        },
        {
            "id":55,
            "name": "Group",
            "children":[
                {
                    "id":551,
                    "name": "Mark Din"
                },
                {
                    "id":552,
                    "name": "Wallace Edwards"
                },
                {
                    "id":553,
                    "name": "Mark Din 2"
                }
            ]
        },
        {
            "id":66,
            "name": "Lindsay Cox"
        },
        {
            "id":77,
            "name": "Elmer Mccoy"
        },
        {
            "id":88,
            "name": "Mitchell Santiago"
        }
    ]
} as CustomTreeData;


interface ListSampleState
{
    data:ITreeData
    focusId?:string
}

export class TreeListSample extends React.Component<any, ListSampleState>
{
    constructor(props:any)
    {
        super(props);

        this.state = {
            data: data,
            focusId:"221"
        };

        this.onChangeFocus = this.onChangeFocus.bind(this);
        this.onPressKey = this.onPressKey.bind(this);
        this.onItemDraw = this.onItemDraw.bind(this);
    }

    onChangeFocus(node:CustomTreeData)
    {
        console.log("node focus", node);
        this.setState({ focusId:node.id.toString() })
    }

    onPressKey(e:KeyboardEvent)
    {
        console.log("press key", e);
    }

    onItemDraw(node:CustomTreeData, isSelected:boolean):JSX.Element
    {
        return(
            <div className="item-render">
                <i className={
                    classNames(
                        !node.children && "fa fa-user icon-render",
                        isSelected && "icon-selected"
                    )
            }/>
                { node.name }
            </div>
        );
    }

    render(): JSX.Element
    {
        return (
            <TreeList
                data={ this.state.data }
                showRoot={ true }
                onFocusChanged={ this.onChangeFocus }
                onKeyPress={ this.onPressKey }
                onDrawItem={ this.onItemDraw }
                selectedId={ this.state.focusId }
                dragSupport={ true }
            />
        );
    }
}
