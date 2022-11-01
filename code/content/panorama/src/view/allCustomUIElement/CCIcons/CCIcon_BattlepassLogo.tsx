import React from "react";
import { CCIcon } from "./CCIcon";

interface IIcon_BattlepassLogoType {
	type?: "Flat" | "GrayScale" | "GrayScaleSmall" | "Small";
}
export class CCIcon_BattlepassLogo extends CCIcon<IIcon_BattlepassLogoType> {
	defaultStyle = (() => {
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