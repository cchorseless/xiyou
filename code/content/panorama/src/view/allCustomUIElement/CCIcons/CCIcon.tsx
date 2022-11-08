import { ImageAttributes } from "@demon673/react-panorama";
import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCIcon.less";

export interface ICCIcon {
	/** 资源路径 */
	src?: string;
	/** 旋转角度 */
	rotate?: number;
	/** 是否有旋转动画，默认两秒 */
	spin?: boolean;
	/** 旋转动画时间，有该参数可以省略spin属性 */
	spinDuration?: number;
	/** wash-color */
	color?: string;
	/** 描边 */
	shadow?: boolean;
	/** 透明度 */
	opacity?: number;
	width?: string;
	height?: string;
}


export class CCIcon<T = {}> extends CCPanel<ImageAttributes & ICCIcon & T, ImagePanel> {
	// static defaultProps = {
	// 	src: "s2r://panorama/images/control_icons/dota_logo_white_png.vtex",
	// };
	defaultClass = () => { return CSSHelper.ClassMaker("CC_Icon", this.props.className, { CC_IconSpin: this.props.spin || this.props.spinDuration, CC_IconShadow: this.props.shadow }); };
	defaultStyle = () => {
		return {
			preTransformRotate2d: (this.props.rotate != undefined) ? this.props.rotate + "deg" : undefined,
			washColor: this.props.color,
			animationDuration: (this.props.spinDuration != undefined) ? this.props.spinDuration + "s" : undefined,
			opacity: (this.props.opacity != undefined) ? String(this.props.opacity) : undefined,
			width: CSSHelper.DEFAULT_ICON_SIZE,
			height: CSSHelper.DEFAULT_ICON_SIZE,
		} as any;
	};
	render() {
		return (
			this.__root___isValid &&
			<Image ref={this.__root__}    {...this.initRootAttrs()}>
				{this.props.children}
				{this.__root___childs}
			</Image>
		);
	}
}