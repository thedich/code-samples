import classes = require('classnames');
import React = require('react');

import { Fly, FlyTable } from "../FlyTable";
import { FlyExpandInfo } from "./FlyExpandInfo";
import { LedItem } from "./LedItem";

interface ItemRowProps
{
    itemsData:Fly
}

interface ItemRowState
{
    changed?   : boolean;
    expand?    : boolean;
    version    : number;
    
	infoloaded : boolean;
	isloading  : boolean;
}

export class ItemRow extends React.Component<ItemRowProps, ItemRowState>
{

	private nameExButton:string = "развернуть";
	private expandData:string   = "";
	constructor(props: ItemRowProps)
	{
		super(props);
		
		this.state = {
			changed: false,
			expand: false,
			version: 1,
			infoloaded: false,
			isloading: false
		};
	}

	componentWillReceiveProps(nextProps: ItemRowProps)
    {
        let changed = false;

        if ( nextProps.itemsData.hash != this.props.itemsData.hash ) {
            changed = true;

            setTimeout(() => {
                this.setState({
                   changed: false
                });
            }, 2000);
        }

        if ( this.state.changed != changed ) {
            this.setState({
				changed: changed,
	            version: this.state.version + 1
            });
        }
    }
    
    shouldComponentUpdate(nextProps: ItemRowProps, nextState: ItemRowState)
    {
    	return this.state.version != nextState.version;
    }
    
    onClickRow()
    {
    	if (this.state.isloading)
    		return;
    	
    	if ( !this.state.infoloaded )
	    {
		
		    this.setState({ isloading:true, version: this.state.version + 1 });
		    const boardId:string = this.props.itemsData.id;
		
		    setTimeout(()=> {
			
			    FlyTable.getFlyData( FlyTable.infoFlyPath + boardId ).then((data:any) => {
			    	
				    const infodata = JSON.parse(data);
					this.nameExButton = "свернуть";
					this.expandData = data.toString();
				
				    this.setState({
					    expand: true,
					    version: this.state.version + 1,
					    infoloaded: true,
					    isloading: false
				    });
			    });
			
		    }, 1000);

	    } else
	    {
		    this.nameExButton = "развернуть";
		    this.setState({
			    expand : !this.state.expand,
			    version: this.state.version + 1
		    });
	    }

    	console.log("expand click!");

    }
    
	render(): JSX.Element
	{
	    let fly = this.props.itemsData;
		return (
			<div className={
			    classes(
			        'flytable__row item_holder',
                    this.state.changed && '_state_changed'
                )
			}
			>
                    <div className='flytable___col item'>
                        {
                        	("" + fly.modes).split('').map((el:string, idx) => {
		                        return <LedItem leditem={el} key={idx}/>
	
                            })
                        }
                    </div>

                    <div className='flytable___col item color_white'>
                        {
	                        fly.latitude
                        }
                    </div>

                    <div className='flytable___col item color_white'>
                        {
	
	                        fly.longitude
                        }
                    </div>

                    <div className='flytable___col item'>
                        {
	                        ("" + fly.speed).split('').map((el:string, idx) => {
		                        return <LedItem leditem={el} key={idx}/>
		
	                        })
                        }
                    </div>

                    <div className='flytable___col item'>
                        {
	                        ("" + fly.hight).split('').map((el:string, idx) => {
		                        return <LedItem leditem={el} key={idx}/>
		
	                        })
                        }
                    </div>

                    <div className='flytable___col item'>
                        {
                        	
	                        ("" + fly.flytype).split('').map((el:string, idx) => {
		                        return <LedItem leditem={el} key={idx}/>
		
	                        })
                        }
                    </div>

                    <div className='flytable___col item'>
                        {
	                        ("" + fly.flyfrom).split('').map((el:string, idx) => {
		                        return <LedItem leditem={el} key={idx}/>
		
	                        })
                        }
                    </div>

                    <div className='flytable___col item'>
                        {
	                        ("" + fly.flyto).split('').map((el:string, idx) => {
		                        return <LedItem leditem={el} key={idx}/>
		
	                        })
                        }
                    </div>

                    <div className='flytable___col item'>
                        {
	                        ("" + fly.distance).split('').map((el:string, idx) => {
		                        return <LedItem leditem={el} key={idx}/>
		
	                        })
                        }
                    </div>
					<div className='flytable___col item '>
						
						<button className="expannd_item" onClick={ this.onClickRow.bind(this) }>
							{ this.nameExButton }
						</button>
						
						<div className={classes(
							'info_loader',
							this.state.isloading && '_state_loading'
						)}></div>
						
						
					</div>
				
				{
					this.state.expand &&
					<FlyExpandInfo exData={ JSON.parse(this.expandData) } />
				}
    
			</div>
		);
	}
}