import { iCurrentEvent, iMRGENERATED_EVENT, iREMINDER_ADVANCE } from "../store/calendar/types";
import { iMREVT_EVENT, iMTG_MEETING } from "@eos/mrsoft-core";
import { ViewRange } from "./Enums";

export interface iHour {
    time: string;
    events: iCurrentEvent[];
    meetings: iMTG_MEETING[];
    _type: 'iHour';
}

export interface iDay {
    date: Date;
    generatedEvents: iMRGENERATED_EVENT[];
    notes: iMREVT_EVENT[];
    plans: iMREVT_EVENT[];
    meetings: iMTG_MEETING[];
    reminders: iREMINDER_ADVANCE[];
    isSelected: boolean;
    notCurrentMonth?: boolean;
    mock?: boolean;
    isHoliday?: boolean;
}

export interface iWeek {
    days: iDay[]
    isSelected: boolean;
    numberInYear?: number;
    _type: ViewRange.Week;
}

export interface iMonth {
    name: string;
    index: number;
    days: iDay[];
    isSelected: boolean;
    fromWeekDay: number;
    _type: ViewRange.Month;
}

export interface iDateRange {
    dateFrom: Date;
    dateTo: Date;
    dateRangeHelper: Date;
}

export interface iICS {
    SUMMARY: string;
    DTSTART: string;
    LOCATION: string;
    DESCRIPTION: string;
}