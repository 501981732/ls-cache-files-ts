declare const LSCacheFiles: ILSCacheFiles;
export interface ListConfig {
    version: number;
    url: string;
    type?: string;
}
export interface LSConfig {
    version: number;
    list: ListConfig[];
}
interface ILSCacheFiles {
    __LS__MAP: LSConfig;
    init: () => void;
    loadAndCacheFile: (url: string, version: string | number) => void;
    checkAndCacheFile: (url: string, version: string | number) => void;
    checkCanLocalStorage: boolean;
    needUpdate: (flag?: boolean) => void;
    checkUsedSpace: () => number | string;
}
export default LSCacheFiles;
