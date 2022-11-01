import { PanelAttributes } from "@demon673/react-panorama";
import React, { createRef, ReactNode } from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCSwitch.less";

interface ICCSwitch extends NodePropsData {
	/** 当前是否选中 */
	checked?: boolean,
	/** 选中时的内容 */
	checkedChildren?: ReactNode | string,
	/** 非选中时的内容 */
	unCheckedChildren?: ReactNode | string,
	/** 初始是否选中 */
	defaultChecked?: boolean,
	/** 变化时回调函数 */
	onChange?: (checked: boolean) => void,
}

export class CCSwitch extends CCPanel<ICCSwitch, Button> {
	defaultClass = () => { return CSSHelper.ClassMaker("CC_Switch", { Checked: this.state.checked }); };
	state = { checked: this.props.checked ?? this.props.defaultChecked };
	static defaultProps = {
		/** 初始是否选中 */
		defaultChecked: true,
	};
	updateCheck = (self: Panel, checked: boolean) => {
		this.setState({ checked: checked });
		if (checked) {
			const child = self.FindChildTraverse("CC_SwitchHandle");
			if (child) {
				/** 刚创建等1帧不然有时候获取不到 */
				if (self.actuallayoutwidth == 0) {
					$.Schedule(0, () => {
						this.updateCheck(self, checked);
					});
				} else {
					child.style.x = (self.actuallayoutwidth - child.actuallayoutwidth - 4) + "px";
				}
			}
		} else {
			const child = self.FindChildTraverse("CC_SwitchHandle");
			if (child) {
				child.style.x = "0px";
			}
		}
	};
	componentDidUpdate(prevProps: any, prevState: any, snapshot?: any) {
		if (this.props.checked != undefined && this.__root__.current && this.props.checked != this.state.checked) {
			this.setState({ checked: this.props.checked });
			this.updateCheck(this.__root__.current, this.props.checked);
		}
	}
	render() {
		return (this.__root___isValid &&
			<Button  {...this.initRootAttrs()} ref={this.__root__} onload={self => this.updateCheck(self, Boolean(this.state.checked))} onactivate={self => {
				this.updateCheck(self, !this.state.checked);
				if (this.props.onChange) {
					this.props.onChange(!this.state.checked);
				}
			}}>
				{(typeof this.props.checkedChildren == "string") &&
					<Label className={CSSHelper.ClassMaker("CC_SwitchLabelCheck", { Checked: !this.state.checked })} localizedText={this.props.checkedChildren} />
				}
				{(typeof this.props.checkedChildren == "object") &&
					<Panel className={CSSHelper.ClassMaker("CC_SwitchLabelCheck", { Checked: !this.state.checked })}>
						{this.props.checkedChildren}
					</Panel>
				}
				<Panel id="CC_SwitchHandle" />
				{(typeof this.props.unCheckedChildren == "string") &&
					<Label className={CSSHelper.ClassMaker("CC_SwitchLabelUncheck", { Checked: this.state.checked })} localizedText={this.props.unCheckedChildren} />
				}
				{(typeof this.props.unCheckedChildren == "object") &&
					<Panel className={CSSHelper.ClassMaker("CC_SwitchLabelUncheck", { Checked: this.state.checked })}>
						{this.props.unCheckedChildren}
					</Panel>
				}
				{this.__root___childs}
				{this.props.children}
			</Button>
		);
	}
}