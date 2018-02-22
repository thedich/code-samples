import React = require('react');
import { HashRouter, Route, Switch } from 'react-router-dom';
import { TreeListSample } from "./TreeListSample";

class Main extends React.Component<{}, {}>
{
	private get router(): JSX.Element
	{
		return (
			<HashRouter hashType="hashbang">
				<Switch>
					<Route exact path="/" component={ TreeListSample } />
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