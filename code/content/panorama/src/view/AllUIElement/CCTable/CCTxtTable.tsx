import React, { Fragment } from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCTxtTable.less";

interface ICCTxtTable {
	list: string[];
	/** 默认选中的index */
	defaultSelected?: number;
	/** 通过传入的属性控制选择项而不是组件自动控制 */
	selected?: number;
	group?: string;
	separatorclass?: string;
	onChange?: (index: number, text: string) => void;
}

/** 面包屑组件，不同于前端在dota2中大部分是Tab切换页签的作用 */
export class CCTxtTable extends CCPanel<ICCTxtTable> {

	static defaultProps = {
		list: [],
		group: GGenerateUUID(),
		defaultSelected: 0
	};
	state = { selectedIndex: (this.props.defaultSelected != undefined) ? Math.min(this.props.list.length - 1, Math.max(0, this.props.defaultSelected - 1)) : undefined };
	onSelect = (index: number) => {
		this.setState({ selectedIndex: index });
		if (this.props.onChange) {
			this.props.onChange(index + 1, this.props.list[index]);
		}
	};
	render() {
		return (this.__root___isValid &&
			<Panel id="CC_TxtTable" ref={this.__root__} {...this.initRootAttrs()}>
				{this.props.list.map((name, index) => {
					if (index > 0) {
						return (
							<Fragment key={index}>
								<Label className={CSSHelper.ClassMaker("CC_TxtTableSeparator", this.props.separatorclass)} text="/" />
								<TabButton selected={this.props.selected != undefined ? this.props.selected - 1 == index : this.state.selectedIndex == index} group={this.props.group} onactivate={() => this.onSelect(index)} localizedText={name} />
							</Fragment>
						);
					} else {
						return <TabButton key={index} selected={this.props.selected != undefined ? this.props.selected - 1 == index : this.state.selectedIndex == index} group={this.props.group} onactivate={() => this.onSelect(index)} localizedText={name} />
					}
				})}
				{this.__root___childs}
				{this.props.children}
			</Panel>
		);
	}
}