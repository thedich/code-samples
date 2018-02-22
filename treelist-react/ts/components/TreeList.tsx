import classNames = require('classnames');
import React = require('react');
import ReactDOM = require('react-dom');

class KeyCodes {
    static LEFT:number  = 37;
    static UP:number    = 38;
    static RIGHT:number = 39;
    static DOWN:number  = 40;
}

export interface ITreeData {
	id: number;
	children?: ITreeData[];
}

interface ITreeItemProps {
	node: ITreeData;
	level: number;
	expanded: boolean;
	hasChildren: boolean;
	selected: boolean;
	onDrawItem: (nodeTree: ITreeData, isSelected?: boolean) => JSX.Element;
	onItemSelect: (nodeTree: ITreeData) => void;
	onExpandSwitch: (nodeTree: ITreeData) => void;
	
	isDraggble?:boolean;
	canDrop?:(source: ITreeData, target:ITreeData) => void;
	onItemDrop: (source: ITreeData, target:ITreeData) => void;
	isRoot?:boolean
}

interface ITreeState
{
	isOverDrag:boolean;
}

class TreeItem extends React.Component<ITreeItemProps, ITreeState> {
	
	static targetNode:ITreeData;
	constructor(props:ITreeItemProps)
	{
		super(props);
		
		this.state = {
			isOverDrag:false
		};
	}
	
	private itemDragOver(e:Event)
	{
		e.stopPropagation();
		e.preventDefault();
		if ( this.props.isRoot ) return;
		TreeItem.targetNode = this.props.node;
		this.setState( { isOverDrag:true });
	}
	
	private itemDragLeave(e:DragEvent)
	{
		e.stopPropagation();
		this.setState( { isOverDrag:false });
	}
	
	private dragStart(e:DragEvent)
    {
		e.dataTransfer.effectAllowed = 'none';
	}
	
	private dragDrop(e:DragEvent, node:ITreeData)
	{
		console.log("drop!");
		e.dataTransfer.effectAllowed = 'none';
		this.props.onItemDrop(node, TreeItem.targetNode);
		e.stopPropagation();
		return true;
	}
	
	render(): JSX.Element {
		return (
			<div className = {
				classNames(
					'tree-list__item',
					this.props.selected && '_state_selected',
					this.props.hasChildren ? '_level_' + this.props.level : '_level_' + (this.props.level + 1),
					!this.props.level && !this.props.hasChildren && "_levelzero",
					this.state.isOverDrag && "_dragover"
				)
			}
			     onClick={ () => this.props.onItemSelect(this.props.node) }
			     draggable={ this.props.isDraggble }
			     onDragOver={ (e:any) => this.itemDragOver(e) }
			     onDragLeave={ (e:any) => this.itemDragLeave(e) }
			     onDragStart={ (e:any) => this.dragStart(e) }
			     onDragEnd={ (e:any) => this.dragDrop(e, this.props.node) }
			>
				<div className={
					classNames( this.props.hasChildren ? 'tree-list__expand-icon' : 'tree-list__noicon')}
				     onClick={(e: any) => {

					     e.stopPropagation();
					     this.props.onExpandSwitch(this.props.node)
				     }}
				>
					<i className={
						classNames(!this.props.expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o') }
					/>
				</div>

				<div className={
					classNames(
						'tree-list__itemclass',
						this.props.hasChildren && '_has_children'
					)}>
					{ this.props.onDrawItem(this.props.node, this.props.selected) }
				</div>
			</div>
		)
	}
}

interface ITreeListProps {
	data: ITreeData;
	showRoot: boolean;
	selectedId?: string;
	onDrawItem: (item: ITreeData, isSelected?: boolean) => JSX.Element
	onFocusChanged: (item: ITreeData) => void;
	onFilterItem?: (item: ITreeData, filter:string) => boolean;
	onKeyPress: (e: KeyboardEvent) => void;
	filterText?:string;
	defExpandIds?: string[];
	height?: number;
	dragSupport?: boolean;
	onCanDrop?: (source: ITreeData, target: ITreeData) => boolean;
	onDrop?: (source: ITreeData, target: ITreeData, currentData?:ITreeData) => void
	
}

interface ITreeListState {
	nodeList?: ITreeData[]; // flat list
}

export class TreeList extends React.Component<ITreeListProps, ITreeListState> {

	private expanded: { [id: string]: boolean };
	private findedIDs:{ [id: string]: boolean };
	private filter:string;

    // dictionary node list
	private dictNodes: {
		[id: string]: {
			node: ITreeData;
			parent: ITreeData;
			level: number;
		}
	};

	constructor(props: ITreeListProps) {
		super(props);

		this.filter = this.props.filterText;

		// data prepare
		this.expanded = {};
		this.prepare(props.data);

		// expand by default
		if (this.props.defExpandIds) {
			this.props.defExpandIds.forEach((id: string) => {
					this.expanded[id] = true;
					this.expandToNodeById(id);
				}
			);
		}
		
		// expand to selected item
		if( this.props.selectedId ){
			this.expandToNodeById(this.props.selectedId)
		}

		if ( !this.props.showRoot ) {
			 this.expanded[this.props.data.id] = true;
		}
		
		// tree list to flat list
		this.state = {
			nodeList: this.flatList(this.props.data)
		};
	}

	private expandToNodeById(id:string, finded?:boolean)
	{
		let parent:ITreeData = this.dictNodes[id] && this.dictNodes[id].parent;
		while( parent )
		{
			this.expanded[parent.id] = true;
			let upnode = this.dictNodes[parent.id];
			if ( finded && upnode ) this.findedIDs[parent.id] = true;
			if ( upnode ) parent = upnode.parent;
		}
	}

	private expandToSearch(): void {
		this.findedIDs = {};
		if ( this.props.onFilterItem && this.filter) {
			for (let id in this.dictNodes) {
				let element:ITreeData = this.dictNodes[id].node;
				if( this.props.onFilterItem( element, this.filter )) {
					this.expandToNodeById(id, true);
					this.findedIDs[id] = true;
				}
			}
		}
	}

	private prepare(node: ITreeData) {
		this.dictNodes = {};
		let level = this.props.showRoot ? 0 : -1;
		this.internalPrepare(node, null, level );
		this.expandToSearch();
	}

	// fill dictNodes recursively
	private internalPrepare(node: ITreeData, parent: ITreeData, level: number) {
		this.dictNodes[node.id] = { node: node, parent: parent, level: level };
		
		if (node.children) {
			node.children.forEach((child: ITreeData) => { this.internalPrepare(child, node, level + 1) });
		}
	}

	componentWillReceiveProps(nextProps: ITreeListProps)
	{
		
		if ( nextProps.filterText != this.props.filterText ) {

			this.filter = nextProps.filterText;
			this.prepare(nextProps.data);
			this.setState({nodeList: this.flatList(nextProps.data)});
		}
		
		if ( nextProps.defExpandIds != this.props.defExpandIds ) {
			if ( nextProps.defExpandIds) {
				this.expanded = {};
				nextProps.defExpandIds.forEach((id: string) => {
						this.expanded[id] = true;
						this.expandToNodeById(id);
					}
				);
			}
		}

		if ( nextProps.data != this.props.data ) {

			this.prepare( nextProps.data );
			this.setState({ nodeList: this.flatList(nextProps.data) });
		}
	}

	public setFocus()
	{
		let elem = ReactDOM.findDOMNode(this.refs['treeList']) as HTMLElement;
		elem && elem.focus();
	}

	// resctruct tree
	public invalidate( data?: ITreeData)
	{
		let ndata = data || this.props.data;
		this.prepare(ndata);
		this.state = {
			nodeList: this.flatList(ndata)
		};
	}

	private onExpandSwitch(node: ITreeData) {

		if (this.isNodeExpanded(node)) {
            delete this.expanded[node.id];
        }
        else {
            this.expanded[node.id] = true;
        }

		this.setState({
			nodeList: this.flatList(this.props.data)
		});
	}

	private isNodeExpanded(node: ITreeData): boolean {
		return this.expanded[node.id] as boolean;
	}

	private nodeHasChildren(node: ITreeData): boolean {
		return node.children && node.children.length > 0 as boolean;
	}

	private selectNode(node: ITreeData) {

	    this.scrollToNode(node);
		this.props.onFocusChanged(node);
	}

	private selectedNode(): ITreeData {
		if ( !this.props.selectedId )
			return null;

		let  info = this.dictNodes[this.props.selectedId];
		if ( info )
		    return info.node;
		else
		    return null;
	}

	// scroll to node
	private scrollToNode(node: ITreeData) {
		
		let treeHTML = ReactDOM.findDOMNode(this.refs['treeList']) as HTMLElement;
		let dataHTML = ReactDOM.findDOMNode(this.refs['data']) as HTMLElement;
		let itemHTML = ReactDOM.findDOMNode(this.refs[node.id]) as HTMLElement;
		
		if ( treeHTML && dataHTML && itemHTML ) {

			let top = itemHTML.offsetTop - dataHTML.offsetTop;
			let bottom = top + itemHTML.clientHeight;

			if ( top < treeHTML.scrollTop )
				treeHTML.scrollTop = top;
			else if ( bottom > treeHTML.clientHeight + treeHTML.scrollTop )
				treeHTML.scrollTop = (bottom - treeHTML.clientHeight + 1);
		}
	}

	private onKeyDown(e: any) {
        let node = this.selectedNode();
		switch (e.keyCode)
		{
			case KeyCodes.RIGHT: {
				if (node && this.nodeHasChildren(node) && !this.isNodeExpanded(node)) {
					this.onExpandSwitch(node);
				}
				break;
			}

			case KeyCodes.LEFT: {
				if (node) {
					if (this.isNodeExpanded(node)) {
						this.onExpandSwitch(node);
					} else {
						let nodeInfo = this.dictNodes[node.id];
						if (nodeInfo) {
							let parent = nodeInfo.parent;
							if (parent)
								this.selectNode(parent);
						}
					}
				}
				break;
			}

			case KeyCodes.UP: {
				if (node) {
					let index = this.state.nodeList.indexOf(node);
					if (index > 0) {
						this.selectNode(this.state.nodeList[index - 1]);
					}
				}
				e.preventDefault();
				break;
			}

			case KeyCodes.DOWN: {
				if (node) {
					let index = this.state.nodeList.indexOf(node);
					if (index < this.state.nodeList.length - 1) {
						this.selectNode(this.state.nodeList[index + 1]);
					}
				} else {
					if (this.state.nodeList.length > 0) {
						this.selectNode(this.state.nodeList[0]);
					}
				}
				e.preventDefault();
				break;
			}

			default:
				this.props.onKeyPress && this.props.onKeyPress(e);
		}
	}

	private flatList(rootNode: ITreeData): ITreeData[] {
        let list: ITreeData[] = [];
		this.internalFlatList(rootNode, list);
		
		if ( !this.props.showRoot )
			list.shift();

		if ( this.filter ) {
			list =  list.filter( (node) => {
				return this.findedIDs[node.id];
			});
		}

		return list;
	}

	private internalFlatList(node: ITreeData, list: ITreeData[]) {
		list.push(node);
		if ( this.isNodeExpanded(node) && this.nodeHasChildren(node) ) {
			node.children.forEach((child: ITreeData) => this.internalFlatList(child, list));
		}
	}
	
	private onDropItem(source:ITreeData, target:ITreeData)
	{
        this.props.onDrop && this.props.onDrop(source, target, this.props.data);
		this.changeSourceTarget( source, target );
	}
	
	private changeSourceTarget(source:ITreeData, target:ITreeData){
		
		let newdata:ITreeData = this.props.data;
		let pushnode:ITreeData;
		let doreplace = (node:ITreeData, level = 0, remove?:boolean) => {
			
			node
			&& node.children
			&& node.children.map((el, index) => {
				
				if( !remove && el.id == target.id ){
					
					pushnode = node;
					let isIndex = node.children.indexOf(source);
					if( isIndex != -1 ) {
						node.children.splice(isIndex,1);
					}
					
					let arrend = node.children.slice(index, node.children.length);
					let arrbegin = node.children.slice(0, index);
					arrbegin.push(source);
					
					node.children = arrbegin.concat(arrend);
				}
				
				if( remove && el.id == source.id && pushnode != node)
				{
					let delIndex = node.children.indexOf(source);
					node.children.splice(delIndex,1);
				}
				
				level++;
				doreplace(el, level, remove);
			})
		};
		
		doreplace(newdata);
		doreplace(newdata, 0, true);
		
		this.prepare(newdata);
		this.setState({
			nodeList: this.flatList(newdata)
		})
		
	}
	
	render(): JSX.Element {
		return(
			<div className='tree-list__holder'
			     ref="treeList"
			     onKeyDown={ (e:any) => this.onKeyDown(e) }
			     tabIndex={ 0 }
			     style={{
				     height: this.props.height
			     }}
			>
				<div className="tree-list__main" ref="data">
					{
						this.state.nodeList.map((node: ITreeData, index) => {
							return (
								<TreeItem
									ref = { node.id.toString() }
									key = { node.id + Math.random()*100 }
									node = { node }
									expanded = { this.isNodeExpanded(node) }
									hasChildren = { this.nodeHasChildren(node) }
									level = { this.dictNodes[node.id].level }
									selected = { this.selectedNode() == node }
									onDrawItem = { () => this.props.onDrawItem(node, this.selectedNode() == node) }
									onExpandSwitch = { () => this.onExpandSwitch(node) }
									onItemSelect = { () => this.selectNode(node) }
									isDraggble={ this.props.dragSupport && !node.children }
									onItemDrop={ (source:ITreeData, target:ITreeData) => this.onDropItem(source, target) }
									isRoot={ !index }
								/>
							)
						})
					}
				</div>
			</div>
		);
	}
}
