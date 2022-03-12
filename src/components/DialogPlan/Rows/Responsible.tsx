import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDueDepartment } from "../../../store/dialogPlan/actions";
import { State } from "../../../store";
import { Blue } from "@eos/mrsoft-core";

import dialogNewPlan from "../DialogNewPlan.module.scss";

export default function Responsible() {
    const dispatch = useCallback(useDispatch(), []);
    const { edit, dialogDone, dialogCancelled, DUE_DEPARTMENT } = useSelector((state: State) => state.dialogPlan);
    const resultEdit = (dialogCancelled || dialogDone) ? false : edit;
    const onChangeDueDepartment = (DUE_DEPARTMENT: string) => {
        dispatch(setDueDepartment(DUE_DEPARTMENT));
    }

    return (
        <div className={dialogNewPlan.row}>
            <span className={dialogNewPlan.label}>Ответственный:</span>
            <Blue
                entity="DEPARTMENT"
                value={DUE_DEPARTMENT || ''} //TODO 
                onChange={onChangeDueDepartment}
                className={dialogNewPlan.blue}
                disabled={!resultEdit}
                placeholder="Введите ФИО"
                icon={true}
            />
        </div>
    )
}