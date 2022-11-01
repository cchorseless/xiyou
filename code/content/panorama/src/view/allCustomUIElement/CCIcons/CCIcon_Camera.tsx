import { CCIcon } from "./CCIcon";

export class CCIcon_Camera extends CCIcon<{ type?: "hollow"; }> {
	defaultStyle = () => {
		switch (this.props.type) {
			case "hollow":
				return {
					src: "s2r://panorama/images/control_icons/camera_hollow_png.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/camera_png.vtex",
				};
		}
	}
}