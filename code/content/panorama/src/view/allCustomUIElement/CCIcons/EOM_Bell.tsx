import classNames from "classnames";
import React from "react";
import EOM_Icon from "./CCIcon";

export default class EOM_Bell extends EOM_Icon<{ type: "Off" | "On"; }> {
	static defaultProps = {
		type: "On",
	};
	defaultIconAttribute = (() => {
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
	})();
}