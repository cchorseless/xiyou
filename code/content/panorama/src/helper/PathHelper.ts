export module PathHelper {
    export function getRaretyIndex(str: string) {
        switch (str.toUpperCase()) {
            case "R":
                return 3;
            case "SR":
                return 4;
            case "SSR":
                return 5;
           default:
                return 1;
        }
    }
}
