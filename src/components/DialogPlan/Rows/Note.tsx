import React, { useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useDispatch, useSelector } from "react-redux";
import { setBody } from "../../../store/dialogPlan/actions";
import { State } from "../../../store";

import dialogNewPlan from "../DialogNewPlan.module.scss";

export default function Note() {
    const dispatch = useCallback(useDispatch(), []);
    const { edit, dialogDone, dialogCancelled, BODY } = useSelector((state: State) => state.dialogPlan);
    const resultEdit = (dialogCancelled || dialogDone) ? false : edit;

    const onChangeBody = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(setBody(event.target.value));
    }

    return (
        <div className={dialogNewPlan.row}>
            <span className={dialogNewPlan.label}>Примечание:</span>
            <TextareaAutosize
                disabled={!resultEdit}
                className={dialogNewPlan.textarea}
                value={BODY || ''}
                onChange={onChangeBody}
                minRows={3}
                maxRows={5}
                maxLength={2000}
            />
        </div>
    )
}