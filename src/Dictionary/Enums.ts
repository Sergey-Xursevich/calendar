export enum ViewRange {
    Year = 'Year',
    Month = 'Month',
    Week = 'Week',
    Day = 'Day'
}

export enum EventsType {
    NOTE = 0,
    RESOLUTION = 1,
    VISA_SIGN = 2,

    //Тип события (1 - Мероприятие, 2 - Экспертиза, Собрание (3 - Заседание, 4 - Совещание))
    EVENT = 101,        // Мероприятие
    EXPERTISE = 102,    // Экспертиза
    SESSION = 103,      // Заседание
    MEETING = 104,      // Совещание
    PRIVATE = 105       // Личный
}

export enum StatusTypePlan {
    PLAN = 0,
    CANCELLED = 1,
    EVENT_CREATED = 2,
    DONE = 3
}


export enum StatusTypeMeeting {
    PROJECT = 1,
    IN_WORK = 2,
    DECISION_MAKING = 3,
    VOTE = 4,
    PROTOCOL_NEGOTIATION = 5,
    CANCELLED = 6,
    APPROVED_AGENDA = 7,
    DONE = 10,
}