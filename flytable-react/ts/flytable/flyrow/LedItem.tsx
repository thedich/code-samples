import classes = require('classnames');
import Dom = require('react-dom');
import React = require('react');

interface LedItemProps
{
    leditem: string;
}

interface LedItemState
{
	changed?: boolean;
	leditem: string;
	version: number;
}

export class LedItem extends React.Component<LedItemProps, LedItemState>
{
	private newLed:string;
	constructor(props: LedItemProps)
	{
		super(props);
		this.state = {
			leditem: this.props.leditem,
			version: 1,
			changed: false
		};
		
		this.newLed = '';
	}

    componentWillReceiveProps(nextProps:LedItemProps)
    {
	    let changed = false;
	
	    if ( nextProps.leditem != this.props.leditem ) {
		    changed = true;
		    this.newLed = nextProps.leditem;
		    setTimeout(() => { this.setState({
				    changed: false,
			        leditem: nextProps.leditem,
			        version: this.state.version + 1
			        
			    });
		    }, 1500);
	    }
	
	    if ( this.state.changed != changed ) {
		    this.setState({
			    changed: changed,
			    version: this.state.version + 1
		    });
	    }
    }
	
	shouldComponentUpdate(nextProps: LedItemProps, nextState: LedItemState)
	{
		return this.state.version != nextState.version;
	}

	render(): JSX.Element
	{
		return (
			<div className="flytable___leditem">
				<div className="leditem__val ledval">
					{
						this.newLed ? this.newLed : this.state.leditem
						//this.state.leditem
						
					}
				</div>
				<div className={classes(
					'leditem__newval ledval linear',
					this.state.changed && 'anim'
					)}
				>
					{
						this.newLed
					}
				</div>
				
    
			</div>

		);
	}
}