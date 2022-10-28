import classNames from "classnames";
import React from "react";
import { DEFAULT_ADDON_TYPE } from "../config";
import EOM_Icon from "./CCIcon";

export default class EOM_Plus extends EOM_Icon<{ type?: "Default" | "Gradient" | "Thin" | "Tui7" | "Tui7Plus"; }> {
	static defaultProps = {
		type: DEFAULT_ADDON_TYPE,
	};
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "Default":
				return {
					src: "s2r://panorama/images/control_icons/plus_png.vtex"
				};
			case "Gradient":
				return {
					src: "s2r://panorama/images/control_icons/plus_gradient_png.vtex"
				};
			case "Thin":
				return {
					src: "s2r://panorama/images/control_icons/plus_thin_png.vtex"
				};
			case "Tui7":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui7/btn_add.png"
				};
			case "Tui7Plus":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui7/btn_add_plus.png"
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/plus_png.vtex",
				};
		}
	})();
}