import EOM_Icon from "./CCIcon";

export default class EOM_Camera extends EOM_Icon<{ type?: "hollow"; }> {
	defaultIconAttribute = (() => {
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
	})();
}