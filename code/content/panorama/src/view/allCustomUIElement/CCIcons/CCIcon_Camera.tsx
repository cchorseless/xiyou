import { CCIcon } from "./CCIcon";

export class CCIcon_Camera extends CCIcon<{ type?: "hollow"; }> {
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "hollow":
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/camera_hollow_png.vtex",
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/camera_png.vtex",
				});
		}
	}
}