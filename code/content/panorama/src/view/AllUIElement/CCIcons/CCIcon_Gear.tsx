import React from "react";
import { CCIcon } from "./CCIcon";

export class CCIcon_Gear extends CCIcon<{ type?: "Return" | "Shadow" | "Small" | "Setting" | "Tui7"; }> {
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Return":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/gear_return_png.vtex"
				});
			case "Small":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/gear_small_png.vtex"
				});
			case "Shadow":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/gear_shadow_png.vtex"
				});
			case "Setting":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/settings_png.vtex"
				});
			case "Tui7":
				return Object.assign(styles, {
					src: "s2r://panorama/images/eom_design/icon/tui7/setting_png.vtex",
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/gear_png.vtex",
				});
		}
	}
}