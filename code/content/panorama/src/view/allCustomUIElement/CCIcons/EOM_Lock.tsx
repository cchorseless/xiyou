import classNames from "classnames";
import React from "react";
import { DEFAULT_ADDON_TYPE } from "../config";
import EOM_Icon from "./CCIcon";

export default class EOM_Lock extends EOM_Icon<{ type?: "Small" | "Plus" | "Gold" | "Shadow" | "Tui7"; }> {
	static defaultProps = {
		type: DEFAULT_ADDON_TYPE
	};
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "Small":
				return {
					src: "s2r://panorama/images/profile/icon_locked_psd.vtex",
				};
			case "Plus":
				return {
					src: "s2r://panorama/images/guilds/contracts/locked_icon_psd.vtex",
					height: "width-percentage(126%)"
				};
			case "Gold":
				return {
					src: "s2r://panorama/images/dota_plus/hero_progress_locked_png.vtex",
					height: "width-percentage(133%)"
				};
			case "Shadow":
				return {
					src: "s2r://panorama/images/status_icons/challenge_locked_psd.vtex",
					height: "width-percentage(120%)"
				};
			case "Tui7":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui7/lock_png.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/lock_medium_png.vtex"
				};
		}
	})();
}