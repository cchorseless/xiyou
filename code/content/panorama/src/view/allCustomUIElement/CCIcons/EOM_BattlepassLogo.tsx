import classNames from "classnames";
import React from "react";
import EOM_Icon, { EOM_IconAttribute } from "./CCIcon";

interface EOM_BattlepassLogoType {
	type?: "Flat" | "GrayScale" | "GrayScaleSmall" | "Small";
}
export default class EOM_BattlepassLogo extends EOM_Icon<EOM_BattlepassLogoType> {
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "Flat":
				return {
					src: "s2r://panorama/images/control_icons/battlepass_logo_flat_png.vtex",
					height: "width-percentage(128%)"
				};
			case "GrayScale":
				return {
					src: "s2r://panorama/images/control_icons/battlepass_logo_grayscale_png.vtex",
					width: "25px",
					height: "width-percentage(128%)",
				};
			case "GrayScaleSmall":
				return {
					src: "s2r://panorama/images/control_icons/battlepass_logo_grayscale_small_png.vtex",
					width: "25px",
					height: "width-percentage(128%)",
				};
			case "Small":
				return {
					src: "s2r://panorama/images/control_icons/battlepass_logo_small_png.vtex",
					height: "width-percentage(100%)",
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/battlepass_logo_png.vtex",
					height: "width-percentage(113%)",
				};
		}
	})();
}