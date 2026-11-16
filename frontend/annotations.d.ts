export interface ListeningMap {
    title: string;
    composer: string;
    album: string;
    performer: string;
    trackid: number;
    uri: string;
    duration: number;
    sections: section[];
    comments: comment[];
    keys: key[];
    listenerType: string;
}
export interface comment {
    commentnumber: number;
    starttime: number;
    lyrics?: string;
    translation?: string;
    notes?: string;
}
export interface key {
    keynumber: number;
    starttime: number;
    keytext: string;
}
export interface section {
    sectionnumber: number;
    measure: string;
    sectionname: string;
    starttime: number;
    endtime: number;
    lyrics?: string;
    translation?: string;
    notes?: string;
}
export declare function createAnnotations(request: ListeningMap): void;
export declare function getAnnotations(): ListeningMap;
export declare function getNotes(): {
    note: string;
    lyrics: string;
    time: number;
}[];
//# sourceMappingURL=annotations.d.ts.map