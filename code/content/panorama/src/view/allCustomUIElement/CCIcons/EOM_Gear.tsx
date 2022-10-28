import classNames from "classnames";
import React from "react";
import EOM_Icon from "./CCIcon";

export default class EOM_Gear extends EOM_Icon<{ type?: "Return" | "Shadow" | "Small" | "Setting" | "Tui7"; }> {
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "Return":
				return {
					src: "s2r://panorama/images/control_icons/gear_return_png.vtex"
				};
			case "Small":
				return {
					src: "s2r://panorama/images/control_icons/gear_small_png.vtex"
				};
			case "Shadow":
				return {
					src: "s2r://panorama/images/control_icons/gear_shadow_png.vtex"
				};
			case "Setting":
				return {
					src: "s2r://panorama/images/control_icons/settings_png.vtex"
				};
			case "Tui7":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui7/setting_png.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/gear_png.vtex",
				};
		}
	})();
}