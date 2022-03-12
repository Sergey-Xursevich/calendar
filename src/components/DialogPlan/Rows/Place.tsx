import React, { useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useDispatch, useSelector } from "react-redux";
import { setPlace } from "../../../store/dialogPlan/actions";
import { State } from "../../../store";

import dialogNewPlan from "../DialogNewPlan.module.scss";

export default function Place() {
    const dispatch = useCallback(useDispatch(), []);
    const { edit, dialogCancelled, dialogDone, PLACE } = useSelector((state: State) => state.dialogPlan);
    const resultEdit = (dialogCancelled || dialogDone) ? false : edit;
    const onChangePlace = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(setPlace(event.target.value));
    }
    return (
        <div className={dialogNewPlan.row}>
            <span className={dialogNewPlan.label}>Место проведения:</span>
            <TextareaAutosize
                disabled={!resultEdit}
                className={dialogNewPlan.textarea}
                value={PLACE}
                onChange={onChangePlace}
                minRows={3}
                maxRows={5}
                maxLength={2000}
            />
        </div>
    )
}