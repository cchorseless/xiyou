import classNames from "classnames";
import React from "react";
import EOM_Icon from "./CCIcon";

export default class EOM_Friend extends EOM_Icon<{ type?: "AddFriend" | "Friends" | "Ghost"; }> {
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "AddFriend":
				return {
					src: "s2r://panorama/images/control_icons/addfriend_png.vtex",
					height: "width-percentage(72%)",
				};
			case "Friends":
				return {
					src: "s2r://panorama/images/control_icons/friends_png.vtex"
				};
			case "Ghost":
				return {
					src: "s2r://panorama/images/control_icons/ghostfriend_inactive_psd.vtex",
					height: "width-percentage(72%)"
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/friend_large_png.vtex"
				};
		}
	})();
}