import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TextareaAutosize from 'react-textarea-autosize';
import DatePicker from "react-datepicker";
import { DM, _ES, SequenceMap, Piper, EntityHelper, Classif, iMREVT_EVENT, deloDialogAlert, iMREVT_REF } from "@eos/mrsoft-core";
import { setMinutes, addMinutes, set } from "date-fns/esm";
import { format, setHours, isBefore, isWithinInterval, subMinutes, isSameDay } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { parseDateRangeForLoading } from '../../../../Utils/CalendarHelper';
import Button from "../../../../UI/components/Button";
import DialogPasteHref from "../ModalWindows/DialogPasteHref";
import DialogCheckDuplicateDL from "../ModalWindows/DialogCheckDuplicateDL";
import { State } from "../../../../store";
import { loadNotes, setSelection } from "../../../../store/calendar/actions";
import { setMakingNewNote } from "../../../../store/common/actions";
import Link from "../../../../UI/components/Link";

import noteCss from "./Note.module.scss";
import Icon from "../../../../UI/components/Icon";

interface iProps {
    event?: iMREVT_EVENT
    setEdit: (isnEvent: false | number) => void;
}

export default function EditNote(props: iProps) {
    const { selection } = useSelector((state: State) => state.calendar);
    const { PageContext, addition, editingNote } = useSelector((state: State) => state.common);
    const { event, setEdit } = props;

    let hrefs: iMREVT_REF[] = event?.MREVT_REF_List || [];
    if (addition) hrefs = [addition];

    const dispatch = useDispatch();
    useEffect(() => {
        if (!selection?.date || editingNote) return;
        const date = set(selection?.date, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
        const now = new Date();
        if (isBefore(date, now) && isSameDay(date, now)) {
            const afterDate = addMinutes(now, 30)
            const minutes = afterDate.getMinutes();
            const difMinutes = minutes % 15;
            setDate(set(afterDate, { minutes: minutes - difMinutes, seconds: 0, milliseconds: 0 }))
        }
        else setDate(date)
    }, [selection, editingNote]);

    const [date, setDate] = useState<Date>(event?.EVENT_DATE ? new Date(event?.EVENT_DATE) : setHours(setMinutes(selection?.date || new Date(), 0), 9));
    const [body, setBody] = useState<string>(event?.BODY || "");
    const [href, setHref] = useState<iMREVT_REF[]>(hrefs);
    useEffect(() => { if (addition?.ISN_DOC) setHref([addition]) }, [addition])
    const [dues, setDues] = useState<string[]>(event?.MREVT_ASSOCIATION_List?.map(item => { return item.DUE_DEPARTMENT || '' }) || []);
    const [duplicatePersons, setDuplicatePersons] = useState<string[]>([])
    const [showDialogPasteHref, setShowDialogPasteHref] = useState(false);
    const [showDialogCheckDuplicateDL, setShowDialogCheckDuplicateDL] = useState(false);

    const addHref = (newHref: iMREVT_REF[]) => {
        const uniq = newHref.filter(newH => {
            if (href.find(oldH =>
                (oldH.ISN_DOC && oldH.ISN_DOC === newH.ISN_DOC) || (oldH.URL && oldH.URL === newH.URL) //одинаковые ISN или одинаковые URL
            )) return false;
            else return true;
        })
        if (!uniq.length) return deloDialogAlert(newHref.length > 1 ? `Ссылки существуют в заметке` : `Ссылка существует в заметке`, 'Дело-Web');
        setHref([...href, ...uniq]);
    }

    const deleteHref = (deletedItem: iMREVT_REF) => {
        const result = href.filter(item => item.ISN_REF !== deletedItem.ISN_REF)
        event?.MREVT_REF_List?.forEach(value => {
            if (value.ISN_REF === deletedItem.ISN_REF) value._State = _ES.Deleted;
        })
        setHref(result);
    }

    const addDL = () => {
        Classif.open("DEPARTMENT", { nodes: false, selected: dues, skipDeleted: false }).then(item => {
            if (!item) return;
            if (typeof item === "string") item = [item];
            item = item.filter(item => PageContext?.CurrentUser.DUE_DEP !== item); //Автора незачем добавлять
            const person = item;
            setDues(person);
        });
    };

    const deleteDL = (DUE: string) => {
        const newDues = dues.filter(item => item !== DUE)
        event?.MREVT_ASSOCIATION_List?.forEach(value => {
            if (value.DUE_DEPARTMENT === DUE) value._State = _ES.Deleted;
        })
        setDues(newDues);
    }

    const save = async () => {
        if (!PageContext) return;
        const list = await Piper.load<iMREVT_EVENT[]>('MREVT_EVENT', { criteries: { EVENT_DATE: parseDateRangeForLoading(date, date) } }, { expand: 'MREVT_ASSOCIATION_List', saveToStore: true })
        //just believe it
        const filteredList = list.filter(item => {
            const dateEvent = new Date(item.EVENT_DATE || 0);
            const start = subMinutes(dateEvent, 30);
            const end = addMinutes(dateEvent, 30);
            const isInRange = isWithinInterval(date, { start, end })
            return item.ISN_EVENT !== event?.ISN_EVENT && isInRange
        });
        const loadedDuplicate = dues.filter(item =>
            filteredList.some(element =>
                element.DUE_DEPARTMENT === item
                || element.MREVT_ASSOCIATION_List?.some(x =>
                    x.DUE_DEPARTMENT === item
                )
            )
        );
        const author = filteredList.find(item =>
            item.DUE_DEPARTMENT === PageContext.CurrentUser.DUE_DEP
            || item.MREVT_ASSOCIATION_List?.some(item => item.DUE_DEPARTMENT === PageContext.CurrentUser.DUE_DEP)
        )?.DUE_DEPARTMENT;
        if (author && PageContext.CurrentUser.DUE_DEP) loadedDuplicate.push(PageContext.CurrentUser.DUE_DEP);
        setDuplicatePersons(loadedDuplicate);
        if (loadedDuplicate.length) setShowDialogCheckDuplicateDL(true)
        else saveNote()
    };

    const saveNote = async () => {
        if (event) event._State = _ES.Modified;
        const eventToSave = event || EntityHelper.createEntity<iMREVT_EVENT>("MREVT_EVENT", {
            ISN_EVENT: SequenceMap.getTempIsn(),
            EVENT_TYPE: 0,
            DUE_DEPARTMENT: PageContext?.CurrentUser.DUE_DEP,
            IS_PERSONAL: 1, //TODO: сделать в таблице необязательным
            STATUS: 1, //TODO: сделать в таблице необязательным
            IS_COMMON: 1, //TODO: сделать в таблице необязательным
        })
        eventToSave.BODY = body;
        eventToSave.EVENT_DATE = format(date, "yyyy-MM-dd'T'HH:mm:ss");
        dues.forEach(val => {
            if (!eventToSave.MREVT_ASSOCIATION_List?.some(x => x.DUE_DEPARTMENT === val)) {
                if (!eventToSave.MREVT_ASSOCIATION_List) eventToSave.MREVT_ASSOCIATION_List = [];
                eventToSave.MREVT_ASSOCIATION_List?.push(
                    EntityHelper.createEntity("MREVT_ASSOCIATION", {
                        ISN_EVENT: eventToSave.ISN_EVENT,
                        DUE_DEPARTMENT: val,
                        _State: "POST",
                    })
                )
            }
        })
        href.forEach(val => {
            if (!eventToSave.MREVT_REF_List?.some(x => x.ISN_REF === val.ISN_REF)) {
                if (!eventToSave.MREVT_REF_List) eventToSave.MREVT_REF_List = [];
                eventToSave.MREVT_REF_List?.push(
                    EntityHelper.createEntity("MREVT_REF", {
                        ISN_EVENT: eventToSave.ISN_EVENT,
                        ISN_DOC: val.ISN_DOC,
                        REF_KIND: val.REF_KIND,
                        URL: val.URL,
                        _State: "POST",
                    })
                )
            }
        })
        await Piper.save(eventToSave);
        dispatch(setSelection({}))
        dispatch(loadNotes());
        dispatch(setMakingNewNote(false));
        setEdit(false);
    }

    const cancel = () => {
        setBody(event?.BODY || "")
        setHref(hrefs)
        setDues(event?.MREVT_ASSOCIATION_List?.map(item => { return item.DUE_DEPARTMENT || '' }) || [])
        setEdit(false);
        dispatch(setMakingNewNote(false))
    }

    return (
        <div className={noteCss.note}>
            <div className={noteCss.header}>
                <div className={noteCss.date}>
                    <DatePicker
                        className={noteCss.datePicker}
                        selected={date}
                        onChange={e => setDate(e ? (e as Date) : new Date())}
                        customInput={<div className={noteCss.customDatePicker}>{format(date, 'HH:mm')}</div>}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Время"
                        timeFormat="HH:mm"
                        excludeTimes={[
                            setHours(setMinutes(new Date(), 0), 0)
                        ]}
                    />
                    <div>
                        <Icon className={noteCss.timeLabel} name="timeLabel" />
                    </div>
                </div>
                <span>
                    {isBefore(new Date(), date) &&
                        <Icon className={noteCss.buttonAddDL} onClick={addDL} name="addDL" title="Добавить Должностное Лицо" />
                    }
                    <Icon className={noteCss.buttonAddLink} onClick={() => setShowDialogPasteHref(true)} name="addLink" title="Добавить ссылку" />
                </span>
            </div>
            <div className={noteCss.textNoteWrap}>
                <TextareaAutosize
                    className={noteCss.editable}
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    placeholder="Текст заметки"
                    maxLength={2000}
                    rows={6}
                />
                {href.map(item => <Link key={item.ISN_REF} href={item} isEdit={true} setHref={deleteHref} />)}
            </div>
            <div className={noteCss.author}>
                {event && DM.get("DEPARTMENT", event.DUE_DEPARTMENT).SURNAME}
                {!event && PageContext && DM.get("DEPARTMENT", PageContext.CurrentUser.DUE_DEP).SURNAME}
            </div>
            {dues.length > 0 &&
                <div className={noteCss.addedDLWrapper}>
                    <div className={noteCss.addedDLTitle}>Кому</div>
                    <div className={noteCss.addedDLItems}>
                        {dues.map(item => (
                            <div className={noteCss.addedDL} key={item}>
                                <span className={noteCss.classifName}>{DM.get("DEPARTMENT", item, 'CLASSIF_NAME')}</span>
                                <Icon className={noteCss.buttonDeleteDL} title="Удалить ДЛ" name="cross" onClick={() => deleteDL(item)} />
                            </div>
                        ))}
                    </div>
                </div>
            }
            <div className={noteCss.footerButtons}>
                <Button className={noteCss.buttonSave} onClick={save} text="Сохранить" />
                <Button className={noteCss.buttonCancel} onClick={cancel} text="Отмена" styles={{ marginLeft: 10 }} />
            </div>
            <DialogPasteHref
                ISN_EVENT={event?.ISN_EVENT}
                REF_KIND_DOC={'RC'}
                REF_KIND_PRJ={'PRJ'}
                REF_MEETING={'MEETING'}
                show={showDialogPasteHref}
                setHref={addHref}
                showModal={() => setShowDialogPasteHref(false)}
            />
            <DialogCheckDuplicateDL
                show={showDialogCheckDuplicateDL}
                showModal={() => setShowDialogCheckDuplicateDL(false)}
                duplicatePersons={duplicatePersons}
                saveNote={saveNote}
            />
        </div>
    );
}
