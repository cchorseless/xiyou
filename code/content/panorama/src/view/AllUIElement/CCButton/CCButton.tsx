import { TextButtonAttributes } from "@demon673/react-panorama";
import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCIcon_Spinner } from "../CCIcons/CCIcon_Spinner";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCButton.less";

export interface ICCButton {
	/** 图标 */
	icon?: React.ReactNode;
	/** 设置按钮载入状态 */
	loading?: boolean;
	/**
	 * 设置按钮类型
	 * - Default按钮支持"Green" | "Blue" | "Red" | "Purple" | "Gold"颜色
	 * - Primary按钮支持"Gray" | "Black" | "Blue" | "DarkBlue" | "Red"
	 * - Bevel按钮支持"Green" | "DarkGreen" | "Bronze" | "Plus"颜色
	 * - Store按钮支持"Direct" | "InBundle" | "InTreasure" | "AdditionalDropInTreasure" | "DotaPlus" | "Market" | "ShardsPurchase" | "Gift" | "Season_Winter2017" | "Season_International2016" | "Season_Fall2016" | "Season_International2017" | "Season_International2018" | "Season_International2019" | "Season_International2020" | "Season_Spring2021"
	 * */
	type?: "Default" | "Primary" | "Bevel" | "Store" | "Text" | "Outline" | "Tui6" | "Tui7" | "Tui3" | "Style1";
	/** 设置按钮颜色 */
	// color?: "Green" | "Blue" | "Red" | "Purple" | "Gold" | "DarkGreen" | "Bronze" | "Plus" | string;
	color?: "Green" | "Blue" | "Red" | "Purple" | "Gold" | "Gray";
}

export class CCButton extends CCPanel<TextButtonAttributes & ICCButton, TextButton> {
	defaultClass() { return CSSHelper.ClassMaker(this.props.className, "CC_Button", this.props.type, this.props.color, { Loading: this.props.loading }); };
	static defaultProps = {
		/** 设置按钮载入状态 */
		loading: false,
		/** 设置按钮类型 */
		type: "Tui3",
		/** 设置按钮颜色 */
		color: "Green",
	};
	render() {
		return (this.__root___isValid &&
			<TextButton ref={this.__root__}   {...this.initRootAttrs()} enabled={this.props.enabled == undefined ? !this.props.loading : this.props.enabled}>
				{this.props.loading &&
					<CCIcon_Spinner spin width="24px" align="center center" />
				}
				{this.__root___childs}
				{this.props.children}
			</TextButton>
		);
	}
}
export class CCBaseButton extends CCPanel<TextButtonAttributes & ICCButton, TextButton> {
	defaultClass() { return CSSHelper.ClassMaker(this.props.className, "CC_Button", this.props.type, this.props.color, { Loading: this.props.loading }); };
	static defaultProps = {
		/** 设置按钮载入状态 */
		loading: false,
		/** 设置按钮颜色 */
		color: "Green",
	};
	render() {
		return (this.__root___isValid &&
			<TextButton ref={this.__root__}  {...this.initRootAttrs()} enabled={this.props.enabled == undefined ? !this.props.loading : this.props.enabled}>
				{this.props.loading &&
					<CCIcon_Spinner spin width="24px" align="center center" />
				}
				{this.__root___childs}
				{this.props.children}
			</TextButton>
		);
	}
}