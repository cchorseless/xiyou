import React from "react";
import { CCIcon } from "./CCIcon";

export class CCIcon_IconSearch extends CCIcon<{ type?: "Shadow"; }> {
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Shadow":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/icon_search_shadow_psd.vtex",
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/icon_search_png.vtex",
				});
		}
	}
}