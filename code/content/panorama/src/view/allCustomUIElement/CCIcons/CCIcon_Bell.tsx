import React from "react";
import { CCIcon } from "./CCIcon";

export class CCIcon_Bell extends CCIcon<{ type: "Off" | "On"; }> {
	static defaultProps = {
		type: "On",
	};
	defaultStyle = () => {
		switch (this.props.type) {
			case "Off":
				return {
					src: "s2r://panorama/images/control_icons/bell_off_psd.vtex",
				};
			case "On":
				return {
					src: "s2r://panorama/images/control_icons/bell_psd.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/bell_psd.vtex",
				};
		}
	}
}