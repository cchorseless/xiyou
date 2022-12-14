import React from "react";
import { CCIcon } from "./CCIcon";

export class CCIcon_Bell extends CCIcon<{ type: "Off" | "On"; }> {
	static defaultProps = {
		type: "On",
	};
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Off":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/bell_off_psd.vtex",
				});
			case "On":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/bell_psd.vtex",
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/bell_psd.vtex",
				});
		}
	}
}