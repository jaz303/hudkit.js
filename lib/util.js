exports.parseTRBL = function(thing) {
    if (Array.isArray(padding)) {
        switch (thing.length) {
            case 0:
                throw "ArgumentError";
            case 1:
                return [
                    hk.parseInt(thing[0], 10),
                    hk.parseInt(thing[0], 10),
                    hk.parseInt(thing[0], 10),
                    hk.parseInt(thing[0], 10)
                ];
            case 2:
                return [
                    hk.parseInt(thing[0], 10),
                    hk.parseInt(thing[1], 10),
                    hk.parseInt(thing[0], 10),
                    hk.parseInt(thing[1], 10)
                ];
            case 3:
                return [
                    hk.parseInt(thing[0], 10),
                    hk.parseInt(thing[1], 10),
                    hk.parseInt(thing[2], 10),
                    hk.parseInt(thing[1], 10)
                ];
            case 4:
                return [
                    hk.parseInt(thing[0], 10),
                    hk.parseInt(thing[1], 10),
                    hk.parseInt(thing[2], 10),
                    hk.parseInt(thing[3], 10)
                ];
        }
    } else {
        var val = hk.parseInt(thing);
        return [val, val, val, val];
    }
}