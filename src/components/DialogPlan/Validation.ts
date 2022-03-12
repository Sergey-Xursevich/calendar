import { iMREVT_ASSOCIATION } from "@eos/mrsoft-core";
import { isAfter } from "date-fns";
import { EventsType } from "../../Dictionary/Enums";

interface iParamsForValidation {
    EVENT_TYPE: EventsType;
    TITLE: string;
    DUE_DEPARTMENT: string | null;
    EVENT_DATE: Date | null;
    EVENT_DATE_TO: Date | null;
    EVENT_DATE_FACT: Date | null;
    EVENT_DATE_TO_FACT: Date | null;
    IS_PERSONAL: number;
    IS_COMMON: number;
    MREVT_ASSOCIATION: iMREVT_ASSOCIATION[];
}

interface iValidationError {
    field: keyof iParamsForValidation;
    fieldUserName: string;
    errorType: ValidationErrorTypes;
    errorText?: string;
}

enum ValidationErrorTypes {
    EMPTY,
    LOGICAL
}

export const findErrors = ({
    EVENT_TYPE,
    TITLE,
    DUE_DEPARTMENT,
    EVENT_DATE,
    EVENT_DATE_TO,
    EVENT_DATE_FACT,
    EVENT_DATE_TO_FACT,
    IS_PERSONAL,
    IS_COMMON,
    MREVT_ASSOCIATION
}: iParamsForValidation) => {
    const errors: iValidationError[] = [];
    // Не может быть пустым по дизайну
    if (EVENT_TYPE === null || EVENT_TYPE === undefined)
        errors.push({
            field: 'EVENT_TYPE',
            fieldUserName: 'Вид события',
            errorType: ValidationErrorTypes.EMPTY,
        })
    if (!TITLE || TITLE?.length === 0)
        errors.push({
            field: 'TITLE',
            fieldUserName: 'Тема',
            errorType: ValidationErrorTypes.EMPTY,
        })
    if (!DUE_DEPARTMENT || DUE_DEPARTMENT?.length === 0)
        errors.push({
            field: 'DUE_DEPARTMENT',
            fieldUserName: 'Ответственный',
            errorType: ValidationErrorTypes.EMPTY,
        })
    if (!EVENT_DATE)
        errors.push({
            field: 'EVENT_DATE',
            fieldUserName: 'Дата начала',
            errorType: ValidationErrorTypes.EMPTY,
        })
    if (EVENT_DATE && EVENT_DATE_TO && isAfter(EVENT_DATE, EVENT_DATE_TO))
        errors.push({
            field: 'EVENT_DATE',
            fieldUserName: 'Дата начала',
            errorType: ValidationErrorTypes.LOGICAL,
            errorText: 'Дата начала должна быть меньше Даты окончания'
        })
    if (EVENT_DATE_FACT && EVENT_DATE_TO_FACT && isAfter(EVENT_DATE_FACT, EVENT_DATE_TO_FACT))
        errors.push({
            field: 'EVENT_DATE_FACT',
            fieldUserName: 'Дата начала(факт.)',
            errorType: ValidationErrorTypes.LOGICAL,
            errorText: 'Дата начала(факт.) должна быть меньше Даты оконч.(факт.)'
        })
    if (!IS_PERSONAL && !MREVT_ASSOCIATION.length) {
        errors.push({
            field: 'MREVT_ASSOCIATION',
            fieldUserName: 'Подразделение',
            errorType: ValidationErrorTypes.EMPTY,
            errorText: 'Подразделения должны быть заполнены если Принадлежность - Подразделения'
        })
    }
    const emptyErrors = errors.filter(item => item.errorType === ValidationErrorTypes.EMPTY);
    const logicalErrors = errors.filter(item => item.errorType === ValidationErrorTypes.LOGICAL);
    const emptyErrorsText =
        emptyErrors.length > 0
            ? emptyErrors.length > 1
                ? `Поля ${emptyErrors.map(item => item.fieldUserName).join(', ')} обязательны для заполнения`
                : `Поле ${emptyErrors[0].fieldUserName} обязательно для заполнения`
            : '';
    const logicalErrorsText =
        logicalErrors.length > 0
            ? logicalErrors.map(item => item.errorText).join(', ')
            : ''
    const errorsText = [emptyErrorsText, logicalErrorsText].filter(item => item).join(', ')
    return errorsText;
}