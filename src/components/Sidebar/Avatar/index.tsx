import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { iDEPARTMENT, DM, Utils, iPageContext, deloDialogAlert } from "@eos/mrsoft-core";
import { State } from "../../../store";
import { setDueCurrentUser } from "../../../store/common/actions";
import Selection, { iOption } from "../../../UI/components/Selection";
import { setSelection } from "../../../store/calendar/actions";
import UserDefault from "../../../UI/components/assets/UserDefault.svg";

import avatar from "./Avatar.module.scss";
import Icon from "../../../UI/components/Icon";

export default function Avatar() {
    const dispatch = useDispatch()
    const PageContext = useSelector((state: State) => state.common.PageContext);
    const DUE_CURRENT_USER = useSelector((state: State) => state.common.DUE_CURRENT_USER);
    const showLogDeletedDL = useSelector((state: State) => state.settings.showLogDeletedDL);
    const usersPC = useSelector((state: State) => state.common.usersPC);
    const editingNote = useSelector((state: State) => state.common.editingNote);
    const [objDLs, setObjDLs] = useState(calcObjDLs(usersPC, showLogDeletedDL, PageContext));
    const [selected, setSelected] = useState<iOption>({
        DUE: DUE_CURRENT_USER,
        ISN_CABINET: null,
        values: [],
        element: makeElement(DUE_CURRENT_USER, "SURNAME"),
        shortElement: makeShortElement(DUE_CURRENT_USER, 'SURNAME'),
        disabled: false,
    });
    useEffect(() => {
        setObjDLs(calcObjDLs(usersPC, showLogDeletedDL, PageContext))
    }, [showLogDeletedDL, usersPC, PageContext])

    const image = getImageUrl(DUE_CURRENT_USER);

    function setDL(event: React.MouseEvent<HTMLDivElement, MouseEvent>, item: iOption) {
        if (editingNote) deloDialogAlert('Для дальнейшей работы завершите редактирование элемента', 'Дело-Web')
        else {
            dispatch(setDueCurrentUser(item.DUE, item.ISN_CABINET));
            dispatch(setSelection({}))
            setSelected(item)
        }
    };

    return (
        <div className={avatar.login}>
            <img className={avatar.avatar} src={image} alt="avatar" />
            <Selection selected={selected} options={objDLs} onItemClick={setDL} />
        </div>
    );
}

function makeElement(DUE?: string | number | null, type?: 'SURNAME' | 'CARD_NAME' | 'CABINET_NAME') {
    if (!DUE) return null;
    let upperString;
    let subString;
    let deleted;
    let img;
    if (type === 'SURNAME' && typeof DUE === 'string') {
        upperString = DUE?.indexOf('|') !== -1 ? '' : DM.get("DEPARTMENT", DUE || '', 'SURNAME');
        subString = DUE?.indexOf('|') !== -1 ? '' : DM.get("DEPARTMENT", DUE || '', 'DUTY');
        deleted = DUE?.indexOf('|') !== -1 ? '' : DM.get("DEPARTMENT", DUE || '', 'DELETED');
        img = getImageUrl(DUE);
    }
    if (type === 'CARD_NAME' && typeof DUE === 'string') {
        upperString = DM.get("DEPARTMENT", DUE, 'CARD_NAME');
    }
    if (DUE && type === 'CABINET_NAME')
        upperString = DM.get("CABINET", DUE, 'CABINET_NAME');
    return (
        <div className={avatar.item}>
            {type === 'SURNAME' &&
                <div className={avatar.itemIcons}>
                    {deleted === 1 && <Icon name="cross" color="#FF0000" />}
                    <img className={avatar.miniAvatar} src={img} alt="avatar" />
                </div>
            }
            <div>
                <span className={avatar.name}>{upperString}</span>
                <span className={avatar.post}>{subString}</span>
            </div>
        </div >
    )
}

function makeShortElement(DUE?: string | number | null, type?: 'SURNAME' | 'CARD_NAME' | 'CABINET_NAME') {
    let upperString;
    let subString;
    if (type === 'SURNAME' && typeof DUE === 'string') {
        upperString = DUE?.indexOf('|') !== -1 ? '' : DM.get("DEPARTMENT", DUE || '', 'SURNAME');
        subString = DUE?.indexOf('|') !== -1 ? '' : DM.get("DEPARTMENT", DUE || '', 'DUTY');
    }
    if (type === 'CARD_NAME' && typeof DUE === 'string') {
        upperString = DM.get("DEPARTMENT", DUE, 'CARD_NAME');
    }
    if (DUE && type === 'CABINET_NAME')
        upperString = DM.get("CABINET", DUE, 'CABINET_NAME');
    return (
        <div className={avatar.item}>
            <div>
                <span className={avatar.name}>{upperString}</span>
                <span className={avatar.post}>{subString}</span>
            </div>
        </div>
    )
}

function getImageUrl(DUE_CURRENT_USER?: string | null) {
    if (!DUE_CURRENT_USER) return UserDefault;
    if (~DUE_CURRENT_USER.indexOf('|')) return UserDefault; //Чтобы не выскакивала ошибка в консоли...
    const ISN_PHOTO = DM.get('DEPARTMENT', DUE_CURRENT_USER, "ISN_PHOTO")
    return Utils.getImagePath(ISN_PHOTO) || UserDefault;
}

function calcObjDLs(usersPC: iDEPARTMENT[], showLogDeletedDL: boolean, PageContext?: iPageContext,) {
    // Собираем дерево для отображения в выпадаке
    if (!PageContext || !PageContext.CurrentUser || !PageContext.CurrentUser.USERCARD_List) return [];
    const objDLs: iOption[] = PageContext.CurrentUser.USERCARD_List.map(item => {
        const name = makeShortElement(item.DUE, 'CARD_NAME');
        const values = item.USER_CABINET_List?.map(item => ({
            element: makeElement(item.ISN_CABINET, 'CABINET_NAME'),
            shortElement: makeShortElement(item.ISN_CABINET, 'CABINET_NAME'),
            values: getPersons(item.ISN_CABINET, usersPC, showLogDeletedDL),
            ISN_CABINET: item.ISN_CABINET || null,
            DUE: null,
            disabled: false
        })) || [];
        return {
            element: name,
            shortElement: name,
            values: values,
            ISN_CABINET: null,
            DUE: null,
            disabled: true,
        };
    });
    objDLs.forEach((item: iOption) => {
        let keys: string[] = [];
        if (item.values) item.values.forEach((element: iOption) => {
            element.DUE = element.values
                ? element.values.map(item => item.DUE).join("|")
                : "";
            keys.push(element.DUE);
            if (!element.values?.length) element.disabled = true;
        });
        item.DUE = keys.join("|");
    });
    return objDLs;
}

function getPersons(isnCabinet: number | undefined, usersPC: iDEPARTMENT[], showLogDeletedDL: boolean) {
    if (isnCabinet && usersPC) {
        return usersPC
            .filter((item: iDEPARTMENT) => {
                const isDLInCabinet = item.ISN_CABINET === isnCabinet;
                if (!showLogDeletedDL) return isDLInCabinet && item.DELETED === 0;
                if (showLogDeletedDL) return isDLInCabinet
                return false;
            }
            )
            .map((item: iDEPARTMENT) => {
                return {
                    element: makeElement(item.DUE, "SURNAME"),
                    shortElement: makeElement(item.DUE, "SURNAME"),
                    ISN_CABINET: item.ISN_CABINET,
                    DUE: item.DUE || null,
                    disabled: false,
                    values: []
                };
            });
    }
    else return [];
}
