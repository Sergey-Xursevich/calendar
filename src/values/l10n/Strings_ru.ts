import { ILocalizedStrings } from "../Strings";

export default class Strings_ru implements ILocalizedStrings {
    loadingError = "Произошла ошибка № {0}.";
    wrongIsnPrjInArgs = "Необходимые входящие параметры не были установлены при вызове окна.";
    notificationsOkButton = "OK";
    modelWasNotLoaded = "Запрашиваемый документ не существует, не доступен, либо во время загрузки произошла ошибка.";
    bossTag = "The Boss";
    saveSuccessful = "Сохранение прошло успешно.";
    vsPersonCollision = "Следующие ДЛ не были добавлены, т.к. уже присутствуют в списке визирующих/подписывающих: ";
    termPickerDays = "дн.";
    termPickerWorkdays = "раб. дн.";
    termPickerHours = "часов";
    receiveDate = "Направлено";
    expectedTermDate = "Расчетный срок";
    realTermDate = "Срок";
    replyDate = "Дата";
    signType1 = "Утверждаю";
    signType2 = "Не утверждаю";
    vsStateInProgress = "Направлено";
    vsStateInQueue = "В очереди";
    putToQueue = "Направить в очередь";
    putToNewQueue = "Создать новую";
    blockCaptionUnsent = "Не направленные";
    blockCaptionSent = "Направленные";

    menuSave = "Сохранить маршрут";
    menuTmplSave = "Сохранить как шаблон";
    menuTmplLoad = "Загрузить шаблон";

    brandString = "Конструктор маршрутов";
    templatesLoadError = "Ошибка при загрузке шаблона";
    calendarsLoadError = "Ошибка при загрузке календаря";
    menuTmplSaveListHeader = "Выберите шаблон, который вы хотите перезаписать, или введите имя нового шаблона в поле ниже";
    menuTmplLoadListHeader = "Выберите шаблон, который вы хотите загрузить";
    templateSaveButton = "Сохранить";
    saveEmptyName = "Имя не может быть пустым";
    saveNameAlreadyInUse = "Имя уже занято";
    saveEmptyIsNotAllowed = "Нельзя сохранить пустую карту";
    saveTemplateSuccessful = 'Шаблон успешно сохранен под именем "{0}"';
    confirmTemplateDeletionText = "Вы уверены что хотите удалить этот шаблон?";
    confirmTemplateLoadText = "Загрузка заменит текущий шаблон, продолжить?";
    confirmTemplateSaveText = "Вы уверены, что хотите перезаписать этот шаблон?";

    buttonYes = "Да";
    buttonNo = "Нет";
    buttonRename = "Переим.";
    buttonDel = "Удал.";
    buttonRenameOk = "Переименовать";
    buttonCancel = "Отменить";

    messageModalWindowPaste = "В буфере отсуствуют ссылки!";

    messageImportSuccess = "Импорт данных успешно завершен.";
    messageExportSuccess = "Экспорт данных успешно завершен.";
    messageUnvalideData = "Проверьте данные на валидность или одно из значений имеет пустое значение!";
    messageEmptyExportData = "Данные за указанный период времени отсуствуют. Измените критерии поиска и повторите операцию вновь.";

    textTooltipReminderTodo = "Открыть напоминание";
    textTooltipReminderIcon = "Напоминание";
    textHeaderReminderDay = "Напоминание исполнителю поручения";
}
