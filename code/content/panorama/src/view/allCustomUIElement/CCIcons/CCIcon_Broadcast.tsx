import React from "react";
import { CCIcon } from "./CCIcon";

export class CCIcon_Broadcast extends CCIcon<{ type?: "Nolines"; }> {
	defaultStyle = () => {
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
	};
}