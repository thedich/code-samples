import React = require('react');

import { FlyTable } from 'flytable/FlyTable';
import { HashRouter, Route, Switch } from 'react-router-dom';

class Main extends React.Component<{}, {}>
{
	private get router(): JSX.Element
	{
		return (
			<HashRouter hashType="hashbang">
				<Switch>
					<Route exact path="/" component={ FlyTable } />
				</Switch>
			</HashRouter>
		);
	}

	render(): JSX.Element
	{
		return (
			<div className="page">
				{ this.router }
			</div>
		);
	}
}

export = <Main/>;