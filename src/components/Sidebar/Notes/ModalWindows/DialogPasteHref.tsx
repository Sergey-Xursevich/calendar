import React, { useState, useEffect } from "react";
import { DeloDialog, Piper, iDOC_RC, iPRJ_RC, ButtonPicture, deloDialogAlert, iMREVT_REF, EntityHelper, DM, iMTG_MEETING } from "@eos/mrsoft-core";
import { getEventName } from "../../../../Utils/CalendarHelper";
import { format } from "date-fns";

import IconPasteFromClipboard from "../../../../UI/components/assets/PasteFromClipboardDark.svg";
import x_delete from "../../../../UI/components/assets/x_delete.svg";

import modal from "./ModalWindow.module.scss";

declare var getFromBuf: any; // из Дело

interface iProps {
    ISN_EVENT?: number;
    setHref: (dataRC: iMREVT_REF[]) => void;
    show: boolean;
    showModal?: Function;
    disableInput?: boolean;
    REF_KIND_DOC: string
    REF_KIND_PRJ: string
    REF_MEETING: string;
}

export default function DialogPasteHref(props: iProps) {
    const { setHref, show, showModal, disableInput, ISN_EVENT, REF_KIND_DOC, REF_KIND_PRJ, REF_MEETING } = props
    const [hrefInput, setHrefInput] = useState('');
    const [isReadonly, setReadonly] = useState(false);
    const [dataRC, setDataRC] = useState<iMREVT_REF[]>([]);
    useEffect(() => { setHrefInput(''); setReadonly(false) }, [show])

    const insertHref = async () => {
        const RC: Array<string> = [];
        const PRJ: Array<string> = []
        const MEETING: Array<string> = []
        const docRC: Array<Promise<iDOC_RC>> = []
        const docPRJ: Array<Promise<iPRJ_RC>> = [];
        const mtgMEETING: Array<Promise<iMTG_MEETING>> = [];
        const res = await getFromBuf()
        if (res.d == null) return deloDialogAlert("В буфере нет ссылки на Документ/Проект/Событие", 'Дело-Web')
        res.d.split(",").forEach((x: string) => {
            const eosObjectId = Number(x.split(':')[1]);
            const isn = x.split(':')[0];
            if (eosObjectId === 1) RC.push(isn);
            if (eosObjectId === 2) RC.push(isn);
            if (eosObjectId === 3) RC.push(isn);
            if (eosObjectId === 7) PRJ.push(isn);
            if (eosObjectId === 750) MEETING.push(isn);
            else return false;
        })
        debugger
        if (!RC.length && !PRJ.length && !MEETING.length) return deloDialogAlert("В буфере нет ссылки на Документ/Проект/Событие", 'Дело-Web')

        if (RC.length) docRC.push(Piper.load<iDOC_RC>("DOC_RC", RC.join("|"), { saveToStore: true, cacheFirst: true }));
        if (PRJ.length) docPRJ.push(Piper.load<iPRJ_RC>("PRJ_RC", PRJ.join("|"), { saveToStore: true, cacheFirst: true }));
        if (MEETING.length) mtgMEETING.push(Piper.load<iMTG_MEETING>("MTG_MEETING", MEETING.join("|"), { saveToStore: true, cacheFirst: true }));
        const array = await Promise.all<iDOC_RC | iPRJ_RC | iMTG_MEETING>([...docRC, ...docPRJ, ...mtgMEETING])
        const rc = array
            .reduce((acc, val) => acc.concat(val), [] as Array<iDOC_RC | iPRJ_RC | iMTG_MEETING>) //like Array.flat first level
            .map((item: iDOC_RC | iPRJ_RC | iMTG_MEETING) => EntityHelper.createEntity<iMREVT_REF>('MREVT_REF', {
                ISN_EVENT: ISN_EVENT,
                REF_KIND: 'ISN_DOC' in item
                    ? REF_KIND_DOC
                    : 'ISN_PRJ' in item
                        ? REF_KIND_PRJ
                        : 'ISN_MTG_MEETING' in item
                            ? REF_MEETING
                            : undefined,
                ISN_DOC: 'ISN_DOC' in item
                    ? item.ISN_DOC
                    : 'ISN_PRJ' in item
                        ? item.ISN_PRJ
                        : 'ISN_MTG_MEETING' in item
                            ? item.ISN_MTG_MEETING
                            : undefined,
            }));
        const href = rc.map(item => {
            const doc = DM.get((item.REF_KIND === 'RC' || item.REF_KIND === 'DOC_RC' || item.REF_KIND === 'DOC_RESULT') ? 'DOC_RC' : 'PRJ_RC', item.ISN_DOC) as iDOC_RC | iPRJ_RC;
            const meeting = DM.get('MTG_MEETING', item.ISN_DOC) as iMTG_MEETING;
            if (meeting) {
                return `[${getEventName(meeting)} № ${meeting.MEETING_NUM} от ${format(new Date(meeting.MEETING_DATE), 'dd.MM.yyyy')}]`
            }
            if (doc) {
                if ('ISN_DOC' in doc) return `[РК № ${doc.FREE_NUM} от ${format(new Date(doc.DOC_DATE), 'dd.MM.yyyy')}]`
                if ('ISN_PRJ' in doc) return `[РКПД № ${doc.FREE_NUM} от ${format(new Date(doc.PRJ_DATE), 'dd.MM.yyyy')}]`
            }
            return `[error]`
        }).join("");
        setDataRC(rc)
        setHrefInput(href);
        setReadonly(true);
    }

    const clearHref = () => {
        setDataRC([])
        setHrefInput('');
        setReadonly(false);
    }

    return (
        <DeloDialog
            show={show}
            onClose={showModal}
            title="Вставить ссылку"
            config={{
                actions: [
                    {
                        name: "Вставить",
                        marked: true,
                        click: () => {
                            if (!isReadonly) { // readonly = RC/PRJ_RC
                                if (!hrefInput.match(/[-a-zA-Z0-9@:%_\\+.~#?&\\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\\+.~#?&\\/=]*)?/gi)) {
                                    alert("Некорректная ссылка на сайт!");
                                    return false;
                                }
                            }
                            setHref(dataRC)
                            return true
                        }
                    },
                    {
                        name: "Отмена",
                        click: () => true
                    }
                ],
                layout: (
                    <div className={modal.body}>
                        <span>Название:</span>
                        <div className={modal.control}>
                            <input
                                disabled={disableInput}
                                value={hrefInput}
                                onChange={(e) => {
                                    setHrefInput(e.target.value);
                                    setDataRC([EntityHelper.createEntity<iMREVT_REF>('MREVT_REF', { URL: e.target.value, REF_KIND: 'URL' })])
                                }}
                                className={modal.paste}
                                readOnly={isReadonly}
                                type="text"
                            />
                            {hrefInput.length > 0 && <ButtonPicture src={x_delete} onClick={clearHref} style={{ margin: 0, position: 'absolute', left: 538, top: 91, width: 20, height: 20 }} />}
                            <ButtonPicture hint="Вставить из буфера" src={IconPasteFromClipboard} onClick={insertHref} style={{ margin: 0, height: 20 }} />
                        </div>
                    </div>
                ),
                width: 620
            }}
        />
    )
}