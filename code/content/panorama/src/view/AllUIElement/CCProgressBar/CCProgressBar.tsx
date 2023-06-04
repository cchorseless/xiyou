import React from 'react';
import { CSSHelper } from '../../../helper/CSSHelper';
import { CCPanel } from '../CCPanel/CCPanel';
import "./CCProgressBar.less";

interface ICCProgressBar {
	/** 当前是否选中 */
	// checked?: boolean,
	/** 值 */
	value: number,
	min?: number,
	max?: number,
	/** 变化时回调函数 */
	onChange?: (checked: boolean) => void,

	color?: "Red" | "Blue" | "Gold" | "Green",
}

export class CCProgressBar extends CCPanel<ICCProgressBar> {
	static defaultProps = {
		value: 0,
		min: 0,
		max: 100,
		color: "Red"
	};
	render() {
		let { value, min, max, color } = this.props;
		if (max == 0) {
			max = 1
		}
		const width = (value - min!) / (max! - min!) * 100;
		return (<Panel className="CCProgressBar" ref={this.__root__}   {...this.initRootAttrs()}>
			<CCPanel className={CSSHelper.ClassMaker("CCProgressBar_Left", "ProgressBar_" + color)} width={width + "%"} />
			<CCPanel className="CCProgressBar_Right" width={(100 - width) + "%"} />
			{this.__root___childs}
			{this.props.children}
		</Panel>
		)
	}
}
