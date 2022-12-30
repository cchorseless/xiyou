
interface HashTable {
    // 唯一标识
    __hashuuid__?: string;
    [k: string]: any;
}

export module HashTableHelper {

    const AllHashTable: { [k: string]: HashTable } = {};

    export function CreateHashtable(obj?: HashTable) {
        if (obj && obj.__hashuuid__) {
            return obj
        }
        else if (!obj) {
            obj = {};
        }
        let uuid = GGenerateUUID();
        obj.__hashuuid__ = uuid;
        AllHashTable[uuid] = obj;
        return obj
    }

    export function GetHashtableIndex(obj: HashTable) {
        return obj.__hashuuid__
    }
    export function RemoveHashtable(uuid: string | HashTable) {
        if (typeof uuid === 'string') {
            delete AllHashTable[uuid];
        }
        else {
            let _uuid = GetHashtableIndex(uuid);
            delete AllHashTable[_uuid];
        }
    }
    export function GetHashtableByIndex(uuid: string) {
        if (uuid == null) return;
        return AllHashTable[uuid]
    }
    export function HashtableCount() {
        return Object.keys(AllHashTable).length;
    }
}