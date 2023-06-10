import { CCIcon } from "./CCIcon";

export class CCIcon_Point extends CCIcon<{ type?: "Empty" | "Full" | "Rare"; }> {
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Empty":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/socket_empty_png.vtex",
				});
			case "Full":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/socket_full_png.vtex",
				});
			case "Rare":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/socket_rare_png.vtex",
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/socket_empty_png.vtex",
				});
		}
	}
}