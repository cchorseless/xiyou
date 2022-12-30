export module TimerHelper {
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

    export function Init() {
        let interval = GTimerHelper.GetUpdateInterval();
        $.Schedule(interval, () => {
            Update(interval);
        });
    }
    export function Now() {
        return new Date().getTime()
    }
    function Update(interval: number): void {
        GTimerHelper.Update(interval);
        Init();
    }
}
