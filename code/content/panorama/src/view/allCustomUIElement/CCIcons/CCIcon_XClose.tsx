import React from "react";
import CCIcon from "./CCIcon";


export default class CCIcon_XClose extends CCIcon<{ type?: "Default" | "Gradient" | "Quit" | "Tui7" | "Tui3"; }> {
	defaultStyle = () => {
		switch (this.props.type) {
			case "Default":
				return {
					src: "s2r://panorama/images/control_icons/x_close_png.vtex"
				};
			case "Gradient":
				return {
					src: "s2r://panorama/images/control_icons/x_close_gradient_png.vtex"
				};
			case "Quit":
				return {
					src: "s2r://panorama/images/control_icons/quit_png.vtex"
				};
			case "Tui7":
				return {
					src: "file://{images}/custom_game/eom_design/icon/Tui7/btn_close.png"
				};
			case "Tui3":
				return {
					src: "file://{images}/custom_game/eom_design/icon/Tui3/btn_close.png"
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/x_close_png.vtex",
				};
		}
	};
}