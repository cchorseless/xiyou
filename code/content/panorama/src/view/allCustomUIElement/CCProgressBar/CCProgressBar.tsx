import React from 'react';
import { CCPanel } from '../CCPanel/CCPanel';
import "./CCProgressBar.less";

interface ICCProgressBar {
	/** 当前是否选中 */
	// checked?: boolean,
	/** 值 */
	value: number,
	min: number,
	max: number,
	/** 变化时回调函数 */
	onChange?: (checked: boolean) => void,
}

export class CCProgressBar extends CCPanel<ICCProgressBar> {
	defaultClass() { return "CC_ProgressBar"; };
	static defaultProps = {
		value: 0,
		min: 0,
		max: 100,
	};
	render() {
		const { value, min, max } = this.props;
		const width = (value - min) / (max - min) * 100;
		return (this.__root___isValid &&
			<Panel ref={this.__root__}   {...this.initRootAttrs()}>
				<CCPanel className="CC_ProgressBar_Left" width={width + "%"} />
				<CCPanel className="CC_ProgressBar_Right" width={(100 - width) + "%"} />
				{this.__root___childs}
				{this.props.children}
			</Panel>
		);
	}
}
