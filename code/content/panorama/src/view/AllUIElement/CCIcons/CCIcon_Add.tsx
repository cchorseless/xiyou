import { CCIcon } from "./CCIcon";

export class CCIcon_Add extends CCIcon<{ type?: "Tui3"; }> {
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Tui3":
				return Object.assign(styles, {
					src: "s2r://panorama/images/custom_game/eom_design/icon/tui7/btn_add_png.vtex",
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/custom_game/eom_design/icon/tui7/btn_add_png.vtex",
				});
		}
	}
}