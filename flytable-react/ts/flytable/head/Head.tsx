import classes = require('classnames');
import Dom = require('react-dom');
import React = require('react');

import { RouteComponentProps } from 'react-router';
import { Fly } from "../FlyTable";
import {FlyRows} from "../flyrow/FlyRows";

interface HeadProps {
	onClick(needSort:boolean): void;
}
interface HeadState {}

export class Head extends React.Component<HeadProps, HeadState>
{

	private _distancePrefix:string = '↑↓';
	private _isSortByDistance:boolean = false;
	constructor(props: HeadProps)
	{
		super(props);
		this.state = {};
	}

	sortDistanceClick()
	{

		if(!this._isSortByDistance)
		{
            this.props.onClick(true);
            this._isSortByDistance = true;
            this._distancePrefix = "↓";
            this.setState({});
            return;
		}

        if(this._isSortByDistance)
        {
            this.props.onClick(false);
            this._isSortByDistance = false;
            this._distancePrefix = "↑↓";
            this.setState({});
            return;
        }

	}


	render(): JSX.Element {

		const title = Fly.columnNames();
        return (
            <div className='flytable__head toptitles'>
                <div className='flytable__col title_item'>{ title.modes }</div>
                <div className='flytable__col title_item'>{ title.latitude }</div>
                <div className='flytable__col title_item'>{ title.longitude }</div>
                <div className='flytable__col title_item'>{ title.speed }</div>
                <div className='flytable__col title_item'>{ title.hight }</div>
                <div className='flytable__col title_item'>{ title.flytype }</div>
                <div className='flytable__col title_item'>{ title.flyfrom }</div>
                <div className='flytable__col title_item'>{ title.flyto }</div>
                <div className='flytable__col title_item item_dis' onClick={ this.sortDistanceClick.bind(this) }>{ title.distance + " " +this._distancePrefix }</div>
            </div>
        )
    }
}