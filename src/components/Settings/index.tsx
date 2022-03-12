import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox, ButtonRegular as Button, DM, Piper, iDEPARTMENT, Classif, deloDialogAlert, iMTG_MEETING, iMREVT_EVENT } from "@eos/mrsoft-core";
import { State } from "../../store";
import { showSettings } from "../../store/common/actions";
import { setSettings } from "../../store/settings/actions";

import settingsClasses from "./Settings.module.scss";
import { EventsType } from "../../Dictionary/Enums";
import { loadMeetings, loadPlans } from "../../store/calendar/actions";
import Blue from "../../UI/components/Blue";
import SimpleList from "../../UI/components/SimpleList";
import ReactDatePicker from "react-datepicker";
import Icon from "../../UI/components/Icon";
import { iMRGENERATED_EVENT } from "../../store/calendar/types";
import { downloadIcsFile } from "../../Utils/SaveToIcs";
import FileReaderComponent from "../../UI/components/FileReaderComponent";
import S from "../../values/Strings";

export default function Settings() {
    const settings = useSelector((state: State) => state.settings);
    const calendar = useSelector((state: State) => state.calendar);
    const [participate, setParticipate] = useState(settings.participate);
    const [responsible, setResponsible] = useState(settings.responsible);
    const [createdByMe, setCreatedByMe] = useState(settings.createdByMe);
    const [divisionPlan, setDivisionPlan] = useState(settings.divisionPlan);
    const [organizationPlan, setOrganizationPlan] = useState(settings.organizationPlan);

    const [loadingDLs, setloadingDLs] = useState(false);
    const [DLPlan, setDLPlan] = useState(settings.DLPlan);
    const [DLPlanBlue] = useState('');
    const [DLPlanDUES, setDLPlanDUES] = useState<string[]>(settings.DLPlanDUES);
    const [DLPlanDateStartFrom, setDLPlanDateStartFrom] = useState<Date | null>(settings.DLPlanDateStartFrom);
    const [DLPlanDateStartTo, setDLPlanDateStartTo] = useState<Date | null>(settings.DLPlanDateStartTo);
    const [DLPlanDateFinishFrom, setDLPlanDateFinishFrom] = useState<Date | null>(settings.DLPlanDateFinishFrom);
    const [DLPlanDateFinishTo, setDLPlanDateFinishTo] = useState<Date | null>(settings.DLPlanDateFinishTo);
    const [ExportDateStart, setExportDateStart] = useState<Date>(settings.ExportDateStart || new Date());
    const [ExportDateFinish, setExportDateFinish] = useState<Date | null>(settings.ExportDateFinish);
    const [showLogDeletedDL, setShowLogDeletedDL] = useState(settings.showLogDeletedDL);
    const [showCanceled, setShowCanceled] = useState(settings.showCanceled);
    const [showEvents, setShowEvents] = useState(settings.showEvents);
    const [createByDefault, setCreateByDefault] = useState(settings.createByDefault);
    const [isExportICS, setIsExportICS] = useState<boolean>(false);
    const [isImportICS, setIsImportICS] = useState<boolean>(false);

    useEffect(() => {
        if (DLPlanDUES.length > 0) {
            setloadingDLs(true)
            Piper.load<iDEPARTMENT[]>('DEPARTMENT', DLPlanDUES.join('|'), { saveToStore: true }).then(() => {
                setloadingDLs(false)
            })
        }
    }, [DLPlanDUES])

    const dispatch = useDispatch();
    const styleBtn = (size: number) => { return { padding: `2px ${size}px` } };

    const onSubmit = () => {
        if (!isValid(DLPlan, DLPlanDUES)) {
            deloDialogAlert('Указание должностных лиц в настройках фильтра План должностных лиц обязательно для заполнения', 'Дело-Web')
            return
        }
        dispatch(setSettings({
            participate,
            responsible,
            createdByMe,
            divisionPlan,
            organizationPlan,
            DLPlan,
            DLPlanDUES,
            DLPlanDateStartFrom,
            DLPlanDateStartTo,
            DLPlanDateFinishFrom,
            DLPlanDateFinishTo,
            ExportDateStart,
            ExportDateFinish,
            showCanceled,
            showLogDeletedDL,
            showEvents,
            createByDefault
        }));
        dispatch(showSettings(false));
        dispatch(loadPlans());
        dispatch(loadMeetings());
    }
    const onReject = () => {
        setParticipate(settings.participate)
        setResponsible(settings.responsible)
        setCreatedByMe(settings.createdByMe)
        setDivisionPlan(settings.divisionPlan)
        setOrganizationPlan(settings.organizationPlan)
        setDLPlan(settings.DLPlan)
        setDLPlanDUES(settings.DLPlanDUES)
        setDLPlanDateStartFrom(settings.DLPlanDateStartFrom)
        setDLPlanDateStartTo(settings.DLPlanDateStartTo)
        setDLPlanDateFinishFrom(settings.DLPlanDateFinishFrom)
        setDLPlanDateFinishTo(settings.DLPlanDateFinishTo)
        setShowCanceled(settings.showCanceled)
        setShowLogDeletedDL(settings.showLogDeletedDL)
        setShowEvents(settings.showEvents)
        dispatch(showSettings(false));
    }
    const openClassif = async () => {
        // if (disabled) return;
        const classifResult = await Classif.open('DEPARTMENT', { multi: true, nodes: false });
        if (!classifResult) return;
        await Piper.load<iDEPARTMENT>('DEPARTMENT', classifResult, { saveToStore: true });
        if (Array.isArray(classifResult)) setDLPlanDUES([...DLPlanDUES, ...classifResult]);
        else setDLPlanDUES([...DLPlanDUES, classifResult])
    }

    const exportNote = () => {
        const { meetings, notes, generatedEvents, plans } = calendar;
        const dateStart = new Date(ExportDateStart), dateFinish = ExportDateFinish ? new Date(ExportDateFinish) : null;

        if (!dateStart || !dateFinish) {
            return deloDialogAlert(S.messageUnvalideData);
        }

        const pureEvents: Array<iMREVT_EVENT | iMRGENERATED_EVENT | iMTG_MEETING> = [...meetings, ...notes, ...generatedEvents, ...plans].filter(item => {
            if (item._type === "MREVT_EVENT") {
                return dateStart <= new Date(item.EVENT_DATE) && new Date(item.EVENT_DATE) <= dateFinish;
            }
            if (item._type === "MTG_MEETING") {
                return dateStart <= new Date(item.MEETING_DATE) && new Date(item.MEETING_DATE) <= dateFinish;
            }
            return false;
        });

        if (pureEvents.length > 0) {
            setIsExportICS(true);
            const expDateFinish = ExportDateFinish || new Date();
            downloadIcsFile(pureEvents, ExportDateStart, expDateFinish, true).then(() => {
                setIsExportICS(false);
                deloDialogAlert(S.messageExportSuccess);
            });
        } else {
            deloDialogAlert(S.messageEmptyExportData);
        }
    }

    return (
        <>
            <div className={settingsClasses.settings}>
                <div className={settingsClasses.header}>Настройки</div>
                <div className={settingsClasses.content}>
                    <span>Фильтр отображения по принадлежности к пунктам плана и событиям</span>
                    <Checkbox checked={participate} onChange={() => setParticipate(!participate)} label="Принимаю участие" />
                    <Checkbox checked={responsible} onChange={() => setResponsible(!responsible)} label="Ответственный" />
                    <Checkbox checked={createdByMe} onChange={() => setCreatedByMe(!createdByMe)} label="Созданные мною" />
                    <Checkbox checked={divisionPlan} onChange={() => setDivisionPlan(!divisionPlan)} label="План подразделения" />
                    <Checkbox checked={organizationPlan} onChange={() => setOrganizationPlan(!organizationPlan)} label="План организации" />
                    <Checkbox checked={DLPlan} onChange={() => setDLPlan(!DLPlan)} label="План должностных лиц" />
                    <div className={settingsClasses.DLPlan}>
                        <div className={settingsClasses.iconWrapper}>
                            <Icon
                                className={settingsClasses.icon}
                                // disabled={!resultEdit || !!IS_PERSONAL} 
                                title={'Добавить подразделение'}
                                onClick={openClassif}
                                name="addDLSquare"
                            />
                        </div>
                        <Blue
                            entity="DEPARTMENT"
                            value={DLPlanBlue}
                            onChange={(item) => setDLPlanDUES([...DLPlanDUES, item])}
                            className={settingsClasses.blue}
                            // disabled={!resultEdit}
                            multi={true}
                            placeholder="Должностные лица"
                        />
                        <SimpleList
                            isText={false}
                            // disabled={!resultEdit || !!IS_PERSONAL}
                            items={DLPlanDUES}
                            onChangeItems={setDLPlanDUES}
                            onDelete={(deletedItem) => setDLPlanDUES(DLPlanDUES.filter(item => item !== deletedItem))}
                            filterDeleted={(item) => true}
                            setJSXElement={(item) =>
                                loadingDLs ?
                                    <div>Загрузка...</div> :
                                    <div>{DM.get("DEPARTMENT", item, "CLASSIF_NAME")}</div>
                            }
                        />
                        <div className={settingsClasses.dates}>
                            <div className={settingsClasses.datesStart}>
                                <div className={settingsClasses.labelMain}>Дата начала</div>
                                <div className={settingsClasses.dateFrom}>
                                    <span className={settingsClasses.label}>с:</span>
                                    <div className={settingsClasses.date}>
                                        <ReactDatePicker
                                            className={settingsClasses.datePicker}
                                            {...datepickerOptions({
                                                // edit: resultEdit,
                                                start: DLPlanDateStartFrom ? new Date(DLPlanDateStartFrom) : void 0,
                                                end: DLPlanDateStartTo ? new Date(DLPlanDateStartTo) : void 0,
                                                selected: DLPlanDateStartFrom ? new Date(DLPlanDateStartFrom) : void 0,
                                                onChange: setDLPlanDateStartFrom
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className={settingsClasses.dateTo}>
                                    <span className={settingsClasses.label}>По:</span>
                                    <div className={settingsClasses.date}>
                                        <ReactDatePicker
                                            className={settingsClasses.datePicker}
                                            {...datepickerOptions({
                                                // edit: resultEdit,
                                                start: DLPlanDateStartFrom ? new Date(DLPlanDateStartFrom) : void 0,
                                                end: DLPlanDateStartTo ? new Date(DLPlanDateStartTo) : void 0,
                                                selected: DLPlanDateStartTo ? new Date(DLPlanDateStartTo) : void 0,
                                                onChange: setExportDateStart
                                            })} />
                                    </div>
                                </div>
                            </div>
                            <div className={settingsClasses.datesFinish}>
                                <div className={settingsClasses.labelMain}>Дата окончания</div>
                                <div className={settingsClasses.dateFrom}>
                                    <span className={settingsClasses.label}>с:</span>
                                    <div className={settingsClasses.date}>
                                        <ReactDatePicker
                                            className={settingsClasses.datePicker}
                                            {...datepickerOptions({
                                                // edit: resultEdit,
                                                start: DLPlanDateFinishFrom ? new Date(DLPlanDateFinishFrom) : void 0,
                                                end: DLPlanDateFinishTo ? new Date(DLPlanDateFinishTo) : void 0,
                                                selected: DLPlanDateFinishFrom ? new Date(DLPlanDateFinishFrom) : void 0,
                                                onChange: setDLPlanDateFinishFrom
                                            })} />
                                    </div>
                                </div>
                                <div className={settingsClasses.dateTo}>
                                    <span className={settingsClasses.label}>По:</span>
                                    <div className={settingsClasses.date}>
                                        <ReactDatePicker
                                            className={settingsClasses.datePicker}
                                            {...datepickerOptions({
                                                // edit: resultEdit,
                                                start: DLPlanDateFinishFrom ? new Date(DLPlanDateFinishFrom) : void 0,
                                                end: DLPlanDateFinishTo ? new Date(DLPlanDateFinishTo) : void 0,
                                                selected: DLPlanDateFinishTo ? new Date(DLPlanDateFinishTo) : void 0,
                                                onChange: setDLPlanDateFinishTo
                                            })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span>Фильтр отображения по состояниям</span>
                    <Checkbox checked={showLogDeletedDL} onChange={() => setShowLogDeletedDL(!showLogDeletedDL)} label="Отображать логически удаленные кабинеты и владельцев кабинетов" />
                    <Checkbox checked={showCanceled} onChange={() => setShowCanceled(!showCanceled)} label="Отображать отмененные" />
                    {/* <Checkbox checked={showEvents} onChange={() => setShowEvents(!showEvents)} label="Отображать события" /> */}
                    <span>Создание событий</span>
                    <div>
                        <input
                            type="radio"
                            id="contactChoice1"
                            name="contact"
                            checked={createByDefault === EventsType.MEETING}
                            value={EventsType.MEETING}
                            onChange={() => setCreateByDefault(EventsType.MEETING)}
                        />
                        <label htmlFor="contactChoice1">Создавать собрания с видом «совещание» по умолчанию</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="contactChoice2"
                            name="contact"
                            checked={createByDefault === EventsType.SESSION}
                            value={EventsType.SESSION}
                            onChange={() => setCreateByDefault(EventsType.SESSION)}
                        />
                        <label htmlFor="contactChoice2">Создавать собрания с видом «заседание» по умолчанию</label>
                    </div>
                    <span>Экспорт и Импорт</span>
                    <div className={settingsClasses.exportWrapper}>
                        <div className={settingsClasses.dates}>
                            <div className={`${settingsClasses.datesStart} ${settingsClasses.exportStart}`}>
                                <div className={settingsClasses.dateFrom}>
                                    <span className={settingsClasses.label}>Экспорт за период с:</span>
                                    <div className={settingsClasses.date}>
                                        <ReactDatePicker
                                            className={settingsClasses.datePicker}
                                            {...datepickerOptions({
                                                start: ExportDateStart ? new Date(ExportDateStart) : void 0,
                                                end: ExportDateFinish ? new Date(ExportDateFinish) : void 0,
                                                selected: ExportDateStart ? new Date(ExportDateStart) : void 0,
                                                onChange: setExportDateStart,
                                                format: "dd.MM.yyyy",
                                                isShowTimeSelect: false
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className={settingsClasses.dateTo}>
                                    <span className={settingsClasses.label}>По:</span>
                                    <div className={settingsClasses.date}>
                                        <ReactDatePicker
                                            className={settingsClasses.datePicker}
                                            {...datepickerOptions({
                                                // edit: resultEdit,
                                                start: ExportDateStart ? new Date(ExportDateStart) : void 0,
                                                end: ExportDateFinish ? new Date(ExportDateFinish) : void 0,
                                                selected: ExportDateFinish ? new Date(ExportDateFinish) : void 0,
                                                onChange: setExportDateFinish,
                                                format: "dd.MM.yyyy",
                                                isShowTimeSelect: false
                                            })} />
                                    </div>
                                </div>
                                <div>
                                    <Button className={settingsClasses.btnExport} onClick={exportNote} style={styleBtn(12)}>Экспорт</Button>
                                    {isExportICS && <Icon name="spiner" className={settingsClasses.spinner} />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={settingsClasses.exportWrapper}>
                        <div className={settingsClasses.dates}>
                            <div className={`${settingsClasses.datesStart} ${settingsClasses.exportStart}`}>
                                <span>Импорт информации в заметки из файла iCalendar (.ics)</span>
                                <FileReaderComponent type="ics" text="Импорт" setLoader={setIsImportICS} />
                                {isImportICS && <Icon name="spiner" className={settingsClasses.spinner} />}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={settingsClasses.footer}>
                    <Button onClick={onSubmit} disabled={isExportICS || isImportICS}>Сохранить</Button>
                    <Button onClick={onReject} disabled={isExportICS || isImportICS}>Отмена</Button>
                </div>
            </div >
        </>
    );
}


function datepickerOptions({ edit, start, end, selected, onChange, format = "dd.MM.yyyy HH:mm", isShowTimeSelect = true }: iDatePickerOptions) {
    return {
        locale: "ru",
        dateFormat: format,
        selectsStart: start === selected ? true : false,
        selectsEnd: end === selected ? true : false,
        selected: selected,
        onChange: onChange || (() => { }),
        startDate: start,
        endDate: end,
        showTimeSelect: isShowTimeSelect,
        timeIntervals: 15,
        timeCaption: "Время:",
        timeFormat: "HH:mm",
    };
}

interface iDatePickerOptions {
    onChange: (date: Date) => void;
    edit?: boolean;
    start?: Date;
    end?: Date;
    selected?: Date;
    format?: string;
    isShowTimeSelect?: boolean;
}

function isValid(DLPlan: boolean, DLPlanDUES: string[]) {
    if (DLPlan && DLPlanDUES.length === 0) return false
    return true;
}