import { DM } from "@eos/mrsoft-core";
import { format } from "date-fns";
import { EventsType } from "../Dictionary/Enums";
import { iCurrentEvent } from "../store/calendar/types";
import { getPlanName } from "./CalendarHelper";
import { getDUE_DEPARTMENT, getEVENT_DATE, getEVENT_TYPE } from "./getField";
import { store } from "../store";

declare global {
    interface Navigator {
        msSaveBlob: (blob: Blob, fileName: string) => boolean
    }
}

interface iAttributesICS {
    startTime: string;
    endTime: string;
    description: string;
    location: string;
    title: string;
}

let icsFile: string | null = null;
const makeHeadTemplate = (author: string) => {
    return (
        `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:${author}
METHOD:PUBLISH
X-PUBLISHED-TTL:PT1H
X-WR-CALNAME:Календарь СЭД-Дело ${author}`
    );
};

const makeBodyTemplate = ({ description, startTime, endTime, location, title }: iAttributesICS) => {
    return (
        `BEGIN:VEVENT
UID:${generateUUID()}
SUMMARY:${title}
DTSTAMP:${convertDate(new Date().toString())}
DTSTART:${startTime}
DTEND:${endTime}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT`
    );
}

const makeFooterTemplate = () => {
    return (
        `END:VCALENDAR`
    );
}

export function downloadIcsFile(event: iCurrentEvent[], exportDateStart: Date, exportDateFinish: Date, isMultySelect = false): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        // возможно потребуется реализовывать предзагрузку, но в теории должно все сущности должны быть загружены в dm
        // Piper.load('DEPARTMENT', event.DUE_DEP)
        const name = getFileName(event, exportDateStart, exportDateFinish, isMultySelect);
        try {
            const link = document.createElement('a');
            link.href = generateIcsFile(event) || '';
            link.download = `${name}.ics`;
            link.click();
            return resolve(true)
        } catch (err) {
            var textFileAsBlob = new Blob([generateIcsFields(event)], { type: "text/plain" });
            navigator.msSaveBlob(textFileAsBlob, `${name}.ics`);
            resolve(true);
        }
    });
}

function getFileName(event: iCurrentEvent[], exportDateStart: Date, exportDateFinish: Date, isMultySelect: boolean) {
    const { common } = store.getState();

    const currentUser: string | number = !isMultySelect ?
        getDUE_DEPARTMENT(event[0])! : common.ISN_CABINET ? common.ISN_CABINET : common.DUE_CURRENT_USER!;

    const timeInterval = isMultySelect ?
        `${format(new Date(exportDateStart), "dd.MM.yyyy")}-${format(new Date(exportDateFinish), "dd.MM.yyyy")}`
        : format(new Date(getEVENT_DATE(event[0])), "dd.MM.yyyy HH-mm");

    return `${typeof (currentUser) === 'string' ? DM.get('DEPARTMENT', currentUser, 'SURNAME') : DM.get('CABINET', currentUser, 'CABINET_NAME')} ${timeInterval}`;
}

function convertDate(date: string) {
    return format(new Date(date), "yyyyMMdd'T'HHmmss");
    // DTSTART;TZID=America/New_York:19980119T020000
    // return '19980119T070000Z'
}

function generateIcsFile(event: iCurrentEvent[]) {
    const eventToIcs = generateIcsFields(event);
    if (!eventToIcs) return console.error('Ошибка определения типа передаваемого event')
    // Чтобы не было утечек памяти, удаляем предыдущий ObjectURL если он есть
    if (icsFile !== null) window.URL.revokeObjectURL(icsFile);
    const data = new File([eventToIcs], 'FileName', { type: "text/plain" });
    icsFile = window.URL.createObjectURL(data);
    return icsFile;
}

function generateIcsFields(event: iCurrentEvent[]) {
    const dueDep = store.getState().common.PageContext?.CurrentUser.DUE_DEP;
    const nameCreator: string = DM.get('DEPARTMENT', dueDep, 'SURNAME');

    const bodyEvents = event.reduce((acc: string[], elem) => {
        //Заметка
        if (elem._type === 'MREVT_EVENT' && elem.EVENT_TYPE === EventsType.NOTE) {
            const startTime = convertDate(elem.EVENT_DATE);
            const endTime = startTime;
            const description = formingDescription([elem.BODY, DM.get('DEPARTMENT', elem.DUE_DEPARTMENT, 'CLASSIF_NAME')]).replaceAll("\n", "\\n");
            const title = nameCreator;
            return acc.concat(`${makeBodyTemplate({ startTime, endTime, description, location: "", title })}`);
        }

        // Пункт плана
        if (elem._type === 'MREVT_EVENT') {
            const startTime = convertDate(elem.EVENT_DATE);
            const endTime = elem.EVENT_DATE_TO ? convertDate(elem.EVENT_DATE_TO) : convertDate(new Date().toString());
            const description = formingDescription([getPlanName(getEVENT_TYPE(elem)), elem.REASON, elem.BODY, DM.get('DEPARTMENT', elem.DUE_DEPARTMENT, 'CLASSIF_NAME')]).replaceAll("\n", "\\n");
            const location = elem.PLACE ? elem.PLACE : "", title = elem.TITLE ? elem.TITLE : nameCreator;
            return acc.concat(`${makeBodyTemplate({ startTime, endTime, description, location, title })}`);
        }

        // Событие (Митинги)
        if (elem._type === 'MTG_MEETING') {
            const startTime = convertDate(elem.MEETING_DATE);
            const endTime = elem.REVIEW_END_DATE ? convertDate(elem.REVIEW_END_DATE) : convertDate(new Date().toString());
            const description = formingDescription([getPlanName(getEVENT_TYPE(elem)), elem.MEETING_NUM, elem.REASON, elem.NOTE, DM.get('DEPARTMENT', elem.DUE_DEP, 'CLASSIF_NAME')]).replaceAll("\n", "\\n");
            const location = elem.MEETING_PLACE ? elem.MEETING_PLACE : "", title = elem.NAME || nameCreator;
            return acc.concat(`${makeBodyTemplate({ startTime, endTime, description, location, title })}`);
        }

        // Виза, резолюция
        // if (elem._type === 'MRevtContext') {
        //     return acc;
        // }; 

        return acc
    }, []);

    return `${makeHeadTemplate(nameCreator)}\n${bodyEvents.join("\n")}\n${makeFooterTemplate()}`;
}

function formingDescription(array: (number | string | undefined | null)[]) {
    return array
        .filter(item => item !== undefined && item !== null) // Отсеиваем пустые
        .join('\\n') // Объединяем переносом строки
}

function generateUUID() {
    const maska = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    return maska.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : ((r && 0x3) || 0x8);
        return v.toString(16);
    });
}