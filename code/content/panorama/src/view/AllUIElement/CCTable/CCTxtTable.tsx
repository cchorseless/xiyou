import React from "react";
import { CCLabel } from "../CCLabel/CCLabel";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCTxtTable.less";

interface ICCTxtTable {
	list: string[];
	/** 通过传入的属性控制选择项而不是组件自动控制 */
	selected?: number;
	group?: string;
	sepmarginleft?: string;
	onChange?: (index: number, text: string) => void;
}

/** 面包屑组件，不同于前端在dota2中大部分是Tab切换页签的作用 */
export class CCTxtTable extends CCPanel<ICCTxtTable> {

	static defaultProps = {
		list: [],
		group: GGenerateUUID(),
		selected: 0,
		sepmarginleft: "10px",
		sepmargintop: "0px",

	};
	onSelect(index: number) {
		this.UpdateState({ selectedIndex: index });
		if (this.props.onChange) {
			this.props.onChange(index, this.props.list[index]);
		}
	};
	render() {
		const selectedIndex = this.GetState<number>("selectedIndex", this.props.selected);
		const sepmarginleft = this.props.sepmarginleft
		return (<Panel className="CCTxtTable" ref={this.__root__} {...this.initRootAttrs()}>
			{this.props.list.map((name, index) => {
				if (index > 0) {
					return (
						<CCPanel key={index + ""} flowChildren="right" >
							<CCLabel className="CC_TxtTableSeparator" marginLeft={sepmarginleft} marginRight={sepmarginleft} text="/" />
							<TabButton className="TabButton" selected={selectedIndex == index} group={this.props.group} onactivate={() => this.onSelect(index)} localizedText={name} />
						</CCPanel>
					);
				} else {
					return <TabButton key={index} className="TabButton" selected={selectedIndex == index} group={this.props.group} onactivate={() => this.onSelect(index)} localizedText={name} />
				}
			})}
			{this.__root___childs}
			{this.props.children}
		</Panel>
		);
	}
}