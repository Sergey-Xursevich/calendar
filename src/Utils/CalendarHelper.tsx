import { useEffect, useState } from "react";
import { EventsType, ViewRange } from "../Dictionary/Enums";
import { iDay, iMonth, iDateRange, iWeek } from '../Dictionary/Interfaces';
import { MONTHS_FULL } from '../Dictionary/Constants';
import { iCurrentEvent, iMRGENERATED_EVENT, iREMINDER_ADVANCE } from "../store/calendar/types";
import isSameDay from "date-fns/isSameDay";
import { format, isWeekend, isAfter, isBefore, getDayOfYear } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import { iCALENDAR_CL, iMREVT_EVENT, iMTG_MEETING } from "@eos/mrsoft-core";
import { eachDayOfInterval } from "date-fns/fp";
import { Icons } from "../UI/components/Icon";
import { getEVENT_DATE, getEVENT_DATE_TO, getEVENT_TYPE } from "./getField";

export const DB_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss"

export function getDateRangeHelper(viewType: ViewRange, selection?: iDay) {
    let date = new Date();
    if (selection) date = selection.date
    let dayOfWeek = date.getDay() ? date.getDay() - 1 : 6;
    if (viewType === ViewRange.Day) return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8)
    if (viewType === ViewRange.Week) return new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayOfWeek + 1, 8)
    if (viewType === ViewRange.Month) return new Date(date.getFullYear(), date.getMonth(), 1, 8)
    if (viewType === ViewRange.Year) return new Date(date.getFullYear(), 0, 1, 8)
    return new
        Date()
}

export function parseDateRangeForLoading(dateFrom?: Date, dateTo?: Date) {
    if (!dateFrom) dateFrom = new Date(1900, 0, 1);
    if (!dateTo) dateTo = new Date(2100, 0, 1);
    return `${format(dateFrom, 'yyyy-MM-dd')}:${format(dateTo, 'yyyy-MM-dd')}`
}

export function getSortedData<T>(array: T[] = [], start: Date, end: Date, EVENT_DATE: keyof T, EVENT_DATE_TO: keyof T) {
    let dayEvents: T[] = [];
    const eventsWithDATE = array.filter(item => {
        if (typeof item[EVENT_DATE] !== 'string') return false;
        else return isAfter(new Date(item[EVENT_DATE] as any), start) && isBefore(new Date(item[EVENT_DATE] as any), end)
    })
    const eventsWithDATE_TO = array.filter(item => {
        return !(item[EVENT_DATE] && //чтобы одно событие не добавлялось два раза
            isAfter(new Date(item[EVENT_DATE] as any), start) &&
            isBefore(new Date(item[EVENT_DATE] as any), end)) &&
            item[EVENT_DATE_TO] &&
            isBefore(new Date(item[EVENT_DATE_TO] as any), end) &&
            isAfter(new Date(item[EVENT_DATE_TO] as any), start)
    })
    if (eventsWithDATE_TO) dayEvents.push(...eventsWithDATE_TO);
    if (eventsWithDATE) dayEvents.push(...eventsWithDATE);

    return dayEvents?.reduce((acc, item) => {
        if (item[EVENT_DATE]) {
            const dateOfYear = getDayOfYear(new Date(item[EVENT_DATE] as any));
            if (acc[dateOfYear]) acc[dateOfYear].push(item);
            else acc[dateOfYear] = [item];
        }
        if (item[EVENT_DATE_TO]) {
            const dateToOfYear = getDayOfYear(new Date(item[EVENT_DATE_TO] as any));
            if (acc[dateToOfYear]) acc[dateToOfYear].push(item);
            else acc[dateToOfYear] = [item]
        }
        return acc
    }, [] as T[][])
}

export function getDays(
    dateRange: iDateRange,
    data?: {
        calendarCl: iCALENDAR_CL[],
        generatedEvents: iMRGENERATED_EVENT[],
        notes: iMREVT_EVENT[],
        plans: iMREVT_EVENT[],
        meetings: iMTG_MEETING[],
        reminders: iREMINDER_ADVANCE[],
    },
    selection?: iDay,
): iDay[] {
    const { dateFrom: start, dateTo: end } = dateRange;
    const datesArr = eachDayOfInterval({ start, end });
    const datesWithGeneratedEvents = getSortedData(data?.generatedEvents, start, end, 'EVENT_DATE', 'EVENT_DATE_TO');
    const datesWithNotes = getSortedData(data?.notes, start, end, 'EVENT_DATE', 'EVENT_DATE_TO');
    const datesWithPlans = getSortedData(data?.plans, start, end, 'EVENT_DATE', 'EVENT_DATE_TO');
    const datesWithMeetings = getSortedData(data?.meetings, start, end, 'MEETING_DATE', 'REVIEW_END_DATE');
    const datesWithReminders = getSortedData(data?.reminders, start, end, 'INS_DATE', 'INS_DATE');

    let days = datesArr.map((date, i, array) => {
        let isSelected: boolean = false;
        const dateType = data?.calendarCl.find(item => isSameDay(date, new Date(item.DATE_CALENDAR)))?.DATE_TYPE;
        const dateReminders = (datesWithReminders[getDayOfYear(date)] || []).filter((remind, index, arr) => arr.findIndex(i => i.ISN_REMINDER === remind.ISN_REMINDER) === index);
        if (selection) isSelected = isSameDay(selection.date, date)
        return {
            date: date,
            generatedEvents: datesWithGeneratedEvents[getDayOfYear(date)] || [],
            notes: datesWithNotes[getDayOfYear(date)] || [],
            plans: datesWithPlans[getDayOfYear(date)] || [],
            meetings: datesWithMeetings[getDayOfYear(date)] || [],
            reminders: dateReminders,
            //если длина дней больше 45 то это ViewType=год и соотв не надо ставить notCurrentMonth
            notCurrentMonth: array.length > 45 ? undefined : dateRange.dateRangeHelper.getMonth() !== date.getMonth(),
            isSelected: isSelected,
            isHoliday: (isWeekend(date) && dateType !== 3) || dateType === 1 || dateType === 2,
            _type: ViewRange.Day,
        } as iDay
    });
    return days;
}

export function getWeeks(days: iDay[]): iWeek[] {
    let weeks: iWeek[] = []
    days.forEach((item, index) => {
        if (index % 7 === 0) weeks.push({
            days: [item],
            isSelected: false,
            _type: ViewRange.Week
        } as iWeek)
        else weeks[Math.floor(index / 7)].days.push(item)
    })
    return weeks
}

export function getMonths(days: iDay[]): iMonth[] {
    let months: iMonth[] = MONTHS_FULL.im.map((name, index) => {
        let isSelected: boolean = false;
        return { name: name, index: index, days: [], isSelected: isSelected, fromWeekDay: 0, _type: ViewRange.Month } as iMonth
    });

    let countMonth: number = 0;
    days.forEach((day, index) => {
        if (!index) months[countMonth].fromWeekDay = (day.date.getDay() || 7);
        if (day.date.getMonth() <= countMonth) {
            months[countMonth].days.push(day)
        }
        else {
            countMonth++;
            months[countMonth].fromWeekDay = (day.date.getDay() || 7);
            months[countMonth].days.push(day)
        }
    })

    months.forEach(month => {
        let arr = [];
        while (arr.length < month.fromWeekDay - 1)
            arr.push({ date: month.days[0]?.date, generatedEvents: [], meetings: [], plans: [], notes: [], reminders: [], isToday: false, isSelected: false, mock: true, _type: ViewRange.Day } as iDay);
        month.days.splice(0, 0, ...arr)
    })
    return months;
}

export function DateFormatter(viewType: ViewRange, dateRange: iDateRange, short: boolean) {
    if (viewType === ViewRange.Day) return toDayFormatter(dateRange.dateRangeHelper)
    else if (viewType === ViewRange.Week) return toWeekFormatter(dateRange.dateFrom, dateRange.dateTo, short)
    else if (viewType === ViewRange.Month) return toMonthFormatter(dateRange.dateRangeHelper)
    else if (viewType === ViewRange.Year) return dateRange.dateRangeHelper.getFullYear().toString()
    else return '';
}

export function toDayFormatter(date: Date) {
    return format(date, 'd MMMM yyyy', { locale: ruLocale })
}

export function toWeekFormatter(dateFrom: Date, dateTo: Date, short: boolean) {
    let isDifMonth: boolean = (dateFrom.getMonth() !== dateTo.getMonth());
    if (short) return `${format(dateFrom, 'dd.MM')} - ${format(dateTo, 'dd.MM')}`
    else return `
    с ${isDifMonth
            ? format(dateFrom, 'd MMMM', { locale: ruLocale })
            : format(dateFrom, 'd', { locale: ruLocale })} 
    по ${format(dateTo, 'd MMMM yyyy', { locale: ruLocale })}
    `
}

export function toMonthFormatter(date: Date) {
    const monthName = format(date, 'LLLL yyyy', { locale: ruLocale })
    return monthName[0].toUpperCase() + monthName.slice(1);
}

export function sortEventsByTypeAndDate(a: iCurrentEvent, b: iCurrentEvent) {
    const aEventDate = getEVENT_DATE(a);
    const aEventDateTo = getEVENT_DATE_TO(a);
    const bEventDate = getEVENT_DATE(b);
    const bEventDateTo = getEVENT_DATE_TO(b);
    if (aEventDateTo && bEventDateTo) { return sortByDate(aEventDateTo || "", bEventDateTo || "") }
    if (aEventDateTo === '' && bEventDateTo === '') { return sortByDate(aEventDate || "", bEventDate || "") }
    if (aEventDateTo === '') { return 1 }
    if (bEventDateTo === '') { return -1 }
    return sortByDate(aEventDate || "", bEventDate || "")
}

export function sortByDate(dateA: string, dateB: string) {
    if (dateA > dateB) return 1
    else if (dateA < dateB) return -1
    else return 0
}

export function checkEventType(item: iCurrentEvent, what: string | number) {
    if (typeof what === "number") return getEVENT_TYPE(item) === what;
    else return false
}

export function getUniqByField<T>(arr: T[], field: keyof T, dateEvent: keyof T, reqDate: Date) {
    const uniqArr: T[] = [];
    arr.forEach(item => {
        if (!~uniqArr.findIndex(uniqsItems => item[field] === uniqsItems[field]) && isSameDay(reqDate, new Date(item[dateEvent] as any))) uniqArr.push(item);
    })
    return uniqArr;
}

export function isGeneratedEvent(event: iCurrentEvent) {
    if (event._type === 'MRevtContext') return true;
    else return false;
}

export function isNote(event: iCurrentEvent) {
    if (event._type === 'MREVT_EVENT' && event.EVENT_TYPE === EventsType.NOTE) return true;
    else return false;
}

export function isPlan(event: iCurrentEvent) {
    if (event._type === 'MREVT_EVENT' && (
        event.EVENT_TYPE === EventsType.EVENT ||
        event.EVENT_TYPE === EventsType.EXPERTISE ||
        event.EVENT_TYPE === EventsType.MEETING ||
        event.EVENT_TYPE === EventsType.PRIVATE ||
        event.EVENT_TYPE === EventsType.SESSION
    )) return true;
    else return false;
}

export function isMeeting(event: iCurrentEvent) {
    if (event._type === 'MTG_MEETING') return true;
    else return false;
}

export function getPlanName(eventType?: EventsType): string {
    if (eventType === EventsType.EVENT) return 'Мероприятие';
    if (eventType === EventsType.EXPERTISE) return 'Экспертиза';
    if (eventType === EventsType.SESSION) return 'Заседание';
    if (eventType === EventsType.MEETING) return 'Совещание';
    if (eventType === EventsType.PRIVATE) return 'Личный';
    else return 'cross'
}

export function getIconPlanName(eventType: EventsType | undefined, isFill?: boolean): Icons {
    if (eventType === EventsType.EVENT) return isFill ? 'eventFill' : 'event';
    if (eventType === EventsType.EXPERTISE) return isFill ? 'expertiseFill' : 'expertise';
    if (eventType === EventsType.MEETING) return isFill ? 'sessionFill' : 'session';
    if (eventType === EventsType.SESSION) return isFill ? 'sessionFill' : 'session';
    if (eventType === EventsType.PRIVATE) return isFill ? 'privateFill' : 'private';
    else return 'cross'
}

export function getIconWithHover(nameIcon: string, isHover?: boolean): Icons {
    if (nameIcon === "reminder") return isHover ? 'reminderHover' : 'reminder';
    else return 'cross'
}

export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
}

export function getEventName(event: iMTG_MEETING): string {
    if (event.MEETING_TYPE === 1) return 'Мероприятие';
    if (event.MEETING_TYPE === 2) return 'Экспертиза';
    if (event.MEETING_TYPE === 3) return 'Заседание';
    if (event.MEETING_TYPE === 4) return 'Совещание';
    else return 'Событие'
}