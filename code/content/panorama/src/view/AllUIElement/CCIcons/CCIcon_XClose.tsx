import React from "react";
import { CCIcon } from "./CCIcon";


export class CCIcon_XClose extends CCIcon<{ type?: "Default" | "Gradient" | "Quit" | "Tui7" | "Tui3"; }> {

	static defaultProps = {
		type: "Tui3"
	}

	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Default":
				styles.src = "s2r://panorama/images/control_icons/x_close_png.vtex"
				break;
			case "Gradient":
				styles.src = "s2r://panorama/images/control_icons/x_close_gradient_png.vtex"
				break;
			case "Quit":
				styles.src = "s2r://panorama/images/control_icons/quit_png.vtex"
				break;
			case "Tui7":
				styles.src = "file://{images}/custom_game/eom_design/icon/tui7/btn_close.png"
				break;
			case "Tui3":
				styles.src = "file://{images}/custom_game/eom_design/icon/tui3/btn_close.png"
				break;
			default:
				styles.src = "s2r://panorama/images/control_icons/x_close_png.vtex"
				break;
		}
		return styles;
	};
}