import classNames from "classnames";
import React from "react";
import { DEFAULT_ADDON_TYPE } from "../config";
import EOM_Icon from "./CCIcon";

export default class EOM_Check extends EOM_Icon<{ type?: "Default" | "64" | "BoxCheck" | "Gradient" | "Shadow" | "Thin" | "Tui7"; }> {
	static defaultProps = {
		type: DEFAULT_ADDON_TYPE,
	};
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "Default":
				return {
					src: "s2r://panorama/images/control_icons/check_png.vtex"
				};
			case "64":
				return {
					src: "s2r://panorama/images/control_icons/check_64_png.vtex"
				};
			case "BoxCheck":
				return {
					src: "s2r://panorama/images/control_icons/checkbox_check_psd.vtex"
				};
			case "Gradient":
				return {
					src: "s2r://panorama/images/control_icons/check_gradient_png.vtex"
				};
			case "Shadow":
				return {
					src: "s2r://panorama/images/control_icons/check_shadow_png.vtex"
				};
			case "Thin":
				return {
					src: "s2r://panorama/images/control_icons/check_thin_psd.vtex"
				};
			case "Tui7":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui7/confirm_png.vtex",
					height: "width-percentage(72.7%)"
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/check_png.vtex",
				};
		}
	})();
}