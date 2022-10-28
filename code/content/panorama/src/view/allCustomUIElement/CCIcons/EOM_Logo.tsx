import EOM_Icon from "./CCIcon";

export default class EOM_Logo extends EOM_Icon<{ type?: "Eom" | "Argo"; }> {
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "Eom":
				return {
					src: "s2r://panorama/images/eom_design/icon/eom/logo_eom_png.vtex",
				};
			case "Argo":
				return {
					src: "s2r://panorama/images/eom_design/icon/eom/logo_argo_png.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/eom_design/icon/eom/logo_eom_png.vtex",
				};
		}
	})();
}