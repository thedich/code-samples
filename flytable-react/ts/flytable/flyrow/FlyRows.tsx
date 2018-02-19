import classes = require('classnames');
import Dom = require('react-dom');
import React = require('react');
import { ItemRow } from 'flytable/flyrow/ItemRow';
import { Fly } from "../FlyTable";

interface FlyRowsProps
{
    rowData: Fly[]
}

interface FlyRowsState
{
	rowData:Fly[]
}

export class FlyRows extends React.Component<FlyRowsProps, FlyRowsState>
{
	constructor(props: FlyRowsProps)
	{
		super(props);
		this.state = {
		    rowData: this.props.rowData
		};
	}

    componentWillReceiveProps(nextProps:FlyRowsProps)
    {
        this.setState({
            rowData: nextProps.rowData,
        });
    }

	render(): JSX.Element
	{
        if(!this.props.rowData.length ) return null;
		return (
			<div className='items_holder'>
                {
                    this.state.rowData.map((el:Fly, idx) => {
                        return <ItemRow itemsData={el} key={ el.id } />;
                    })
                }
			</div>

		);
	}
}