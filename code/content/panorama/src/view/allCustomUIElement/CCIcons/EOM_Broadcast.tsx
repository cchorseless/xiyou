import classNames from "classnames";
import React from "react";
import EOM_Icon from "./CCIcon";

export default class EOM_Broadcast extends EOM_Icon<{ type?: "Nolines"; }> {
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "Nolines":
				return {
					src: "s2r://panorama/images/control_icons/broadcast_nolines_psd.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/broadcast_psd.vtex",
				};
		}
	})();
}