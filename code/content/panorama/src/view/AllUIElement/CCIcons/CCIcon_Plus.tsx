import { CSSHelper } from "../../../helper/CSSHelper";
import { CCIcon } from "./CCIcon";

export class CCIcon_Plus extends CCIcon<{ type?: "Default" | "Gradient" | "Thin" | "Tui7" | "Tui7Plus"; }> {
	static defaultProps = {
		type: CSSHelper.DEFAULT_ADDON_TYPE,
	}
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Default":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/plus_png.vtex"
				});
			case "Gradient":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/plus_gradient_png.vtex"
				});
			case "Thin":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/plus_thin_png.vtex"
				});
			case "Tui7":
				return Object.assign(styles, {
					src: "s2r://panorama/images/eom_design/icon/tui7/btn_add.png"
				});
			case "Tui7Plus":
				return Object.assign(styles, {
					src: "s2r://panorama/images/eom_design/icon/tui7/btn_add_plus.png"
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/plus_png.vtex",
				});
		}
	}
}