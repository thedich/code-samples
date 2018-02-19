import classes = require('classnames');
import Dom = require('react-dom');
import React = require('react');

interface ExpandData {}
interface FlyExpandProps
{
    exData: ExpandData;
}

interface FlyExpandInfoState
{
    exData:ExpandData;
}

export class FlyExpandInfo extends React.Component<FlyExpandProps, FlyExpandInfoState>
{

	constructor(props: FlyExpandProps)
	{
		super(props);
		
		this.state = {
            exData: this.props.exData
		};
	}

    componentWillReceiveProps(nextProps:FlyExpandProps)
    {
        this.setState({
            exData: nextProps.exData
        });
    }

	render(): JSX.Element
	{
		let a = this.props.exData as any;
		let url = '';
		if (a.aircraft && a.aircraft.images && a.aircraft.images.medium && a.aircraft.images.medium[0])
			url = a.aircraft.images.medium[0].src;
		
		return (
			<div className="flytable__expandinfo">
				<div className="flytable__exp__hol">
					
					<img src={url} />
				</div>
			</div>
		);
	}
}