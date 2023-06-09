import { CCIcon } from "./CCIcon";

interface IIcon_BattlepassLogoType {
	type?: "Tui3" | "Flat" | "GrayScale" | "GrayScaleSmall" | "Small";
}
export class CCIcon_BattlepassLogo extends CCIcon<IIcon_BattlepassLogoType> {
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Tui3":
				return Object.assign(styles, {
					src: "s2r://panorama/images/custom_game/bp/plus_small_png.vtex",
				});
			case "Flat":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/battlepass_logo_flat_png.vtex",
					height: "width-percentage(128%)"
				});
			case "GrayScale":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/battlepass_logo_grayscale_png.vtex",
					width: "25px",
					height: "width-percentage(128%)",
				});
			case "GrayScaleSmall":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/battlepass_logo_grayscale_small_png.vtex",
					width: "25px",
					height: "width-percentage(128%)",
				});
			case "Small":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/battlepass_logo_small_png.vtex",
					height: "width-percentage(100%)",
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/battlepass_logo_png.vtex",
					height: "width-percentage(113%)",
				});
		}
	}
}