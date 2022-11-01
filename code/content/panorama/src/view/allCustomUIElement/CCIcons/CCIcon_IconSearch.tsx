import React from "react";
import { CCIcon } from "./CCIcon";

export class CCIcon_IconSearch extends CCIcon<{ type?: "Shadow"; }> {
	defaultStyle = () => {
		switch (this.props.type) {
			case "Shadow":
				return {
					src: "s2r://panorama/images/control_icons/icon_search_shadow_psd.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/icon_search_png.vtex",
				};
		}
	}
}