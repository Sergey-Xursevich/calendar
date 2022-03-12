import { ViewRange } from "../Dictionary/Enums";
import { startOfWeek, endOfWeek, endOfMonth, startOfDay } from "date-fns";
import { startOfMonth, startOfYear, endOfYear, endOfDay } from "date-fns/esm";

export function getDateRange(dateRangeHelper: Date, viewType: ViewRange, direction?: 'prev' | 'next' | 'reset' | 'custom') {
    if (direction === "reset") dateRangeHelper = new Date()
    let dates: Date[] = [];
    if (viewType === ViewRange.Day) {
        if (direction === "next") dateRangeHelper = new Date(dateRangeHelper.getFullYear(), dateRangeHelper.getMonth(), dateRangeHelper.getDate() + 1, 8)
        if (direction === "prev") dateRangeHelper = new Date(dateRangeHelper.getFullYear(), dateRangeHelper.getMonth(), dateRangeHelper.getDate() - 1, 8)
        dates = [startOfDay(dateRangeHelper), endOfDay(dateRangeHelper)]
    }
    if (viewType === ViewRange.Week) {
        if (direction === "next") dateRangeHelper = new Date(dateRangeHelper.getFullYear(), dateRangeHelper.getMonth(), dateRangeHelper.getDate() + 7, 8)
        if (direction === "prev") dateRangeHelper = new Date(dateRangeHelper.getFullYear(), dateRangeHelper.getMonth(), dateRangeHelper.getDate() - 7, 8)
        dates = getWeekDates(dateRangeHelper)
    }
    if (viewType === ViewRange.Month) {
        if (direction === "next") dateRangeHelper = new Date(dateRangeHelper.getFullYear(), dateRangeHelper.getMonth() + 1, 1, 8)
        if (direction === "prev") dateRangeHelper = new Date(dateRangeHelper.getFullYear(), dateRangeHelper.getMonth() - 1, 1, 8)
        dates = getMonthDates(dateRangeHelper)
    }
    if (viewType === ViewRange.Year) {
        if (direction === "next") dateRangeHelper = new Date(dateRangeHelper.getFullYear() + 1, 0, 1, 8)
        if (direction === "prev") dateRangeHelper = new Date(dateRangeHelper.getFullYear() - 1, 0, 1, 8)
        dates = getYearDates(dateRangeHelper)
    }
    return { dateRangeHelper, dateFrom: dates[0], dateTo: dates[1] }
}

export function getWeekDates(date: Date) {
    return [startOfWeek(date, { weekStartsOn: 1 }), endOfWeek(date, { weekStartsOn: 1 })]
}

export function getMonthDates(date: Date) {
    const firstDayinViewMonth = startOfWeek(startOfMonth(date), { weekStartsOn: 1 })
    const lastDayinViewMonth = endOfWeek(endOfMonth(date), { weekStartsOn: 1 })
    return [firstDayinViewMonth, lastDayinViewMonth];
}

export function getYearDates(date: Date) {
    const firstDayInYear = startOfYear(date);
    const lastDayInYear = endOfYear(date);
    return [firstDayInYear, lastDayInYear];
}
