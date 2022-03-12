/// <reference types="react-scripts" />

//do delo declarations here.
declare var openDialog: (url: string, callback?: (r, data) => any) => void;
declare var openPopUp: (url: string, callback?: (e, data) => any) => void;
declare var notifyOpener: () => void;
declare var getFromBuf: () => Promise<{ d: string }>;

//untyped modules
declare module 'dateformat';