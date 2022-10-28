import EOM_Icon from "./CCIcon";

export default class EOM_Vip extends EOM_Icon<{ type?: "Blue" | "Purple" | "Vip" | "Sun"; }> {
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "Blue":
				return {
					src: "s2r://panorama/images/eom_design/icon/eom/vip_mon_png.vtex",
				};
			case "Purple":
				return {
					src: "s2r://panorama/images/eom_design/icon/eom/vip_sem_png.vtex",
				};
			case "Vip":
				return {
					src: "s2r://panorama/images/eom_design/icon/eom/vip_large_png.vtex",
				};
			case "Sun":
				return {
					src: "s2r://panorama/images/eom_design/icon/eom/vip_sun_png.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/eom_design/icon/eom/vip_mon_png.vtex",
				};
		}
	})();
}