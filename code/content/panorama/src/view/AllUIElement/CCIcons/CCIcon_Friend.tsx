import React from "react";
import { CCIcon } from "./CCIcon";

export class CCIcon_Friend extends CCIcon<{ type?: "AddFriend" | "Friends" | "Ghost"; }> {
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "AddFriend":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/addfriend_png.vtex",
					height: "width-percentage(72%)",
				});
			case "Friends":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/friends_png.vtex"
				});
			case "Ghost":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/ghostfriend_inactive_psd.vtex",
					height: "width-percentage(72%)"
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/friend_large_png.vtex"
				});
		}
	}
}