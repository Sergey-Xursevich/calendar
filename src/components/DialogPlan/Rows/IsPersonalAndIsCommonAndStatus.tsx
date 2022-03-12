import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, deloDialogConfirm, iMREVT_REF, _ES } from "@eos/mrsoft-core";
import { setIsCommon, setIsPersonal, setStatus, setCancelReason, setMrEvtAssociation, setMrEvtRefCancel } from "../../../store/dialogPlan/actions";
import { StatusTypePlan } from "../../../Dictionary/Enums";
import { State } from "../../../store";

import dialogNewPlan from "../DialogNewPlan.module.scss";

export default function IsPersonalAndIsCommonAndStatus() {
    const dispatch = useCallback(useDispatch(), []);
    const { plan, edit, dialogDone, dialogCancelled, IS_COMMON, IS_PERSONAL, STATUS, MREVT_ASSOCIATION, MREVT_REF_RESULTS } = useSelector((state: State) => state.dialogPlan);
    const resultEdit = (dialogCancelled || dialogDone) ? false : edit;

    const onChangeIsPersonal = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const IS_PERSONAL = +event.target.value ? 1 : 0;
        if (IS_PERSONAL === 1) {
            dispatch(setIsCommon(0));
            setMrEvtAssociation(MREVT_ASSOCIATION.map(item => {
                item._State = _ES.Deleted;
                return item;
            }))
        }
        dispatch(setIsPersonal(IS_PERSONAL));
    }

    const onChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const NEW_STATUS = +event.target.value;

        const cleanResult = () => {
            setCancelReason('');
            onChangeMrEvtRefCancel(MREVT_REF_RESULTS.map(item => {
                item._State = _ES.Deleted
                return item;
            }));
            dispatch(setStatus(NEW_STATUS));
        }

        if (STATUS === StatusTypePlan.DONE && NEW_STATUS === StatusTypePlan.PLAN) {
            deloDialogConfirm('Поле "Итоги" будет очищено, продолжить?', 'Дело-WEB').then(cleanResult)
        }
        else if (STATUS === StatusTypePlan.CANCELLED && NEW_STATUS === StatusTypePlan.PLAN) {
            deloDialogConfirm('Поле "Причины отмены" будет очищено, продолжить?', 'Дело-WEB').then(cleanResult)
        }
        else dispatch(setStatus(NEW_STATUS));
    }

    const onChangeIsCommon = (isCommon: boolean) => {
        const IS_COMMON = isCommon ? 1 : 0;
        dispatch(setIsCommon(IS_COMMON));
    }

    const onChangeMrEvtRefCancel = (items: iMREVT_REF[]) => {
        dispatch(setMrEvtRefCancel(items));
    }

    const statusOptions = () => {
        return (
            <>
                {(!plan || plan.STATUS === StatusTypePlan.PLAN || plan.STATUS === StatusTypePlan.CANCELLED || plan.STATUS === StatusTypePlan.DONE) &&
                    <option value={StatusTypePlan.PLAN}>План</option>
                }
                {(!plan || plan.STATUS === StatusTypePlan.PLAN || plan.STATUS === StatusTypePlan.CANCELLED) &&
                    <option value={StatusTypePlan.CANCELLED}>Отменен</option>
                }
                {(!plan || plan.STATUS === StatusTypePlan.PLAN || plan.STATUS === StatusTypePlan.DONE) &&
                    <option value={StatusTypePlan.DONE}>Выполнен</option>
                }
            </>
        )
    }

    return (
        <>
            <div className={dialogNewPlan.row}>
                <div className={dialogNewPlan.columnLeft}>
                    <span className={dialogNewPlan.label}>Принадлежность:</span>
                    <select disabled={!resultEdit} value={IS_PERSONAL} onChange={onChangeIsPersonal} name="Attachment" className={dialogNewPlan.dropDown}>
                        <option value={1}>Личный</option>
                        <option value={0}>Подразделения</option>
                    </select>
                </div>
                <div className={dialogNewPlan.columnRight}>
                    <span className={dialogNewPlan.label}>Статус:</span>
                    <select disabled={!resultEdit} value={STATUS} onChange={onChangeStatus} name="StatusType" className={dialogNewPlan.dropDown}>
                        {statusOptions()}
                    </select>
                </div>
            </div>
            <div className={dialogNewPlan.row}>
                <span className={dialogNewPlan.label}></span>
                <Checkbox disabled={!resultEdit || !!IS_PERSONAL} inline label="С вложенными подразделениями" checked={!!IS_COMMON} onChange={onChangeIsCommon} />
            </div>
        </>
    )
}