import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import cl from "classnames";
import { DM, Core, iMREVT_REF, iDOC_RC, iPRJ_RC, Piper, iMTG_MEETING } from "@eos/mrsoft-core";
import { getEventName } from "../../Utils/CalendarHelper";
import { State } from "../../store";
import Icon from "./Icon";

import link from "../styles/Link.module.scss";

interface iProps {
    href: iMREVT_REF;
    isEdit: boolean;
    setHref?: (deletedItem: iMREVT_REF) => void;
    backGround?: boolean;
}

export default function Link(props: iProps) {
    const { href, isEdit, setHref, backGround = true } = props;
    const PageContext = useSelector((state: State) => state.common.PageContext);
    const [str, setStr] = useState('Загрузка...');
    const [isValidHref, setIsValidHref] = useState<boolean>(true);
    useEffect(() => {
        const setString = (res: iDOC_RC | iPRJ_RC | iMTG_MEETING | iDOC_RC[] | iPRJ_RC[] | iMTG_MEETING[]) => {
            if (Array.isArray(res)) res = res[0];
            switch (res._type) {
                case 'DOC_RC': return setStr(`РК № ${res.FREE_NUM} от ${format(new Date(res.DOC_DATE), 'dd.MM.yyyy')}`);
                case 'PRJ_RC': return setStr(`РКПД № ${res.FREE_NUM} от ${format(new Date(res.PRJ_DATE), 'dd.MM.yyyy')}`);
                case 'MTG_MEETING': return setStr(`${getEventName(res)} № ${res.MEETING_NUM} от ${format(new Date(res.MEETING_DATE), 'dd.MM.yyyy')}`);
                default: return '';
            }
        }

        const setErrorString = () => {
            setStr('РК/РКПД была удалена или недоступна');
            setIsValidHref(false);
        };

        if (href.REF_KIND === 'RC' || href.REF_KIND === 'DOC_RC' || href.REF_KIND === 'DOC_RESULT')
            Piper.load<iDOC_RC>("DOC_RC", href.ISN_DOC, { saveToStore: true, cacheFirst: true }).then(setString, setErrorString)
        if (href.REF_KIND === 'PRJ' || href.REF_KIND === 'PRJ_RC' || href.REF_KIND === 'PRJ_RESULT')
            Piper.load<iPRJ_RC>("PRJ_RC", href.ISN_DOC, { saveToStore: true, cacheFirst: true }).then(setString, setErrorString)
        if (href.REF_KIND === 'MEETING')
            Piper.load<iMTG_MEETING>("MTG_MEETING", href.ISN_DOC, { saveToStore: true, cacheFirst: true }).then(setString, setErrorString)

    }, [href])

    const openHref = (item: iMREVT_REF) => {
        if (!PageContext) return null;
        if (!isValidHref) return null;
        const { REF_KIND, ISN_DOC, URL } = item;
        const card_id = DM.get("DEPARTMENT", PageContext.CurrentUser.DUE_DEP, 'DEPARTMENT_DUE');
        const cabinet_id = DM.get("DEPARTMENT", PageContext.CurrentUser.DUE_DEP, 'ISN_CABINET');
        if (REF_KIND === "PRJ" || REF_KIND === "PRJ_RC" || REF_KIND === "PRJ_RESULT")
            return openPopUp(`${Core.DeloPath}/WebRC/PRJ_RC/PRJ_RC.aspx#` +
                `rc_id=${ISN_DOC}&card_id=${card_id}&cabinet_id=${cabinet_id}`)
        if (REF_KIND === "RC" || REF_KIND === "DOC_RC" || REF_KIND === "DOC_RESULT")
            return openPopUp(`${Core.DeloPath}/WebRC/DOC_RC/DOC_RC.aspx#` +
                `rc_id=${ISN_DOC}&card_id=${card_id}&cabinet_id=${cabinet_id}`)
        if (REF_KIND === "MEETING")
            return openPopUp(`${Core.DeloPath}/MeetingsWeb/Cards/Meeting.html#` +
                `meeting_id=${ISN_DOC}&card_id=${card_id}&cabinet_id=${cabinet_id}`)
        return window.open(URL);
    }

    return (
        <div className={cl(link.noteHrefWrapper, { [link.backGround]: backGround })}>
            <span className={link.noteHref} onClick={() => openHref(href)}>{str}</span>
            {isEdit && setHref && <Icon className={link.buttonDeleteLink} title="Удалить ссылку" name="cross" onClick={() => setHref(href)} />}
        </div>
    )
}