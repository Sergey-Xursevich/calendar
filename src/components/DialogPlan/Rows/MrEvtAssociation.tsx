import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Classif, DM, EntityHelper, iDEPARTMENT, iMREVT_ASSOCIATION, Piper, _ES } from "@eos/mrsoft-core";
import { setMrEvtAssociation } from "../../../store/dialogPlan/actions";
import SimpleList from "../../../UI/components/SimpleList";
import Icon from "../../../UI/components/Icon";
import { State } from "../../../store";

import dialogNewPlan from "../DialogNewPlan.module.scss";

export default function MrEvtAssociation() {
    const dispatch = useCallback(useDispatch(), []);
    const { edit, dialogCancelled, dialogDone, ISN_EVENT, IS_PERSONAL, MREVT_ASSOCIATION } = useSelector((state: State) => state.dialogPlan);
    const resultEdit = (dialogCancelled || dialogDone) ? false : edit;
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (MREVT_ASSOCIATION.length === 0) return;
        setLoading(true)
        const depDues = MREVT_ASSOCIATION.map(item => item.DUE_DEPARTMENT).join(',');
        Piper.load<iDEPARTMENT[]>('DEPARTMENT', depDues, { saveToStore: true }).then(res => {
            setLoading(false)
        })
        // Если есть MREVT_ASSOCIATION, загружаем их в стор только первый раз (справочник сам загружает в стор при добавлении, так что здесь надо обработать только единственный случай
        // когда открываем план с MREVT_ASSOCIATION)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const onClickAddDepartments = () => {
        const selected = MREVT_ASSOCIATION.filter(item => item._State !== _ES.Deleted).map(item => item.DUE_DEPARTMENT || '')
        Classif.open('DEPARTMENT', { selected, multi: true, leafs: false }).then(selected => {
            if(!selected) return;
            const newDeps = Array.isArray(selected)
                ? selected
                    .filter(item => {
                        if (MREVT_ASSOCIATION.find((old) => old.DUE_DEPARTMENT === item && old._State !== _ES.Deleted)) return false;
                        else return true;
                    })
                    .map(item =>
                        EntityHelper.createEntity<iMREVT_ASSOCIATION>('MREVT_ASSOCIATION', {
                            DUE_DEPARTMENT: item,
                            ISN_EVENT: ISN_EVENT
                        }))

                : [EntityHelper.createEntity<iMREVT_ASSOCIATION>('MREVT_ASSOCIATION', { DUE_DEPARTMENT: selected, ISN_EVENT: ISN_EVENT })];
            dispatch(setMrEvtAssociation([...MREVT_ASSOCIATION, ...newDeps]));
        })
    }

    const onChangeMrEvtAssociation = (items: iMREVT_ASSOCIATION[]) => {
        dispatch(setMrEvtAssociation(items));
    }

    return (
        <div className={dialogNewPlan.row}>
            <span className={dialogNewPlan.label}>Подразделение:</span>
            <div className={dialogNewPlan.simpleList}>
                <Icon title={'Добавить подразделение'} disabled={!resultEdit || !!IS_PERSONAL} onClick={onClickAddDepartments} name="addDLSquare" className={dialogNewPlan.icon} />
                <SimpleList
                    isText={false}
                    disabled={!resultEdit || !!IS_PERSONAL}
                    items={MREVT_ASSOCIATION}
                    onChangeItems={onChangeMrEvtAssociation}
                    onDelete={(item) => {
                        item._State = _ES.Deleted;
                        onChangeMrEvtAssociation(MREVT_ASSOCIATION.slice())
                    }}
                    filterDeleted={(item) => item._State !== _ES.Deleted}
                    setJSXElement={(item) => loading ? <div>Загрузка...</div> : <div>{DM.get("DEPARTMENT", item.DUE_DEPARTMENT, "CLASSIF_NAME")}</div>}
                />
            </div>
        </div>
    )
}