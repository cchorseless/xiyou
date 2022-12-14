import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCIcon } from "./CCIcon";

export class CCIcon_Check extends CCIcon<{ type?: "Default" | "64" | "BoxCheck" | "Gradient" | "Shadow" | "Thin" | "Tui7"; }> {
	static defaultProps = {
		type: CSSHelper.DEFAULT_ADDON_TYPE,
	};
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Default":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/check_png.vtex"
				});
			case "64":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/check_64_png.vtex"
				});
			case "BoxCheck":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/checkbox_check_psd.vtex"
				});
			case "Gradient":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/check_gradient_png.vtex"
				});
			case "Shadow":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/check_shadow_png.vtex"
				});
			case "Thin":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/check_thin_psd.vtex"
				});
			case "Tui7":
				return Object.assign(styles, {
					src: "s2r://panorama/images/eom_design/icon/tui7/confirm_png.vtex",
					height: "width-percentage(72.7%)"
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/check_png.vtex",
				});
		}
	}
}