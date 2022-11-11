
export module TipsHelper {
    export function showErrorMessage(msg: string, sound = "General.CastFail_Custom") {
        GameUI.SendCustomHUDError(msg, sound);
    }
}
