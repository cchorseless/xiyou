import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCVerticalTable.less";

interface ICCVerticalTable {
    list: string[];
    /** 默认选中的index */
    defaultSelected?: number;
    /** 通过传入的属性控制选择项而不是组件自动控制 */
    selected?: number;
    group?: string;
    onChange?: (index: number, text: string) => void;
}

export class CCVerticalTable extends CCPanel<ICCVerticalTable> {
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
            <Panel className="CC_VerticalTable" ref={this.__root__}  {...this.initRootAttrs()}>
                {this.props.list.map((sName, index) => {
                    return (
                        <TabButton onactivate={() => this.onSelect(index)}
                            selected={this.props.selected != undefined ? this.props.selected - 1 == index : this.state.selectedIndex == index} group={this.props.group}
                            className={CSSHelper.ClassMaker("VerticalTab")} key={sName}>
                            <Panel id="SelectBG" hittest={false} />
                            <Label localizedText={sName} hittest={false} />
                        </TabButton>
                    );
                })}
                {this.__root___childs}
                {this.props.children}
            </Panel >
        );
    }
}