export module TimerHelper {
    export let isWorking = false;
    export const Offtime = new Date().getTimezoneOffset() * 60 * 1000;
    export const GetTimeDes = (t: number) => {
        t = Math.floor(t);
        let ss = parseInt(t % 60 + "") + "";
        let mm = parseInt(t / 60 % 60 + "") + "";
        let hh = parseInt(t / 60 / 60 + "") + "";
        ss = (ss.length == 2) ? ss : "0" + ss;
        mm = (mm.length == 2) ? mm : "0" + mm;
        hh = (hh.length == 2) ? hh : "0" + hh;
        return `${hh}:${mm}:${ss}`;
    }
    export function Stop() {
        isWorking = false;
    }
    export function Init() {
        //**覆盖 */
        GTimerHelper.NowUnix = NowUnix;
        isWorking = true;
        let interval = GTimerHelper.GetUpdateInterval();
        $.Schedule(interval, () => {
            Update(interval);
        });
    }
    function NowUnix() {
        return Date.now()
    }
    function Update(interval: number): void {
        GTimerHelper.Update(interval);
        isWorking && Init();
    }
}
