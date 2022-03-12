import React, { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deloDialogAlert, iMREVT_REF, _ES } from "@eos/mrsoft-core";
import { setCancelReason, setMrEvtRefCancel } from "../../../store/dialogPlan/actions";
import { StatusTypePlan } from "../../../Dictionary/Enums";
import SimpleList from "../../../UI/components/SimpleList";
import Icon from "../../../UI/components/Icon";

import dialogNewPlan from "../DialogNewPlan.module.scss";
import { State } from "../../../store";
import Link from "../../../UI/components/Link";
import { useScrollIntoView } from "../../Week/useScrollIntoView";
import DialogPasteHref from "../../Sidebar/Notes/ModalWindows/DialogPasteHref";

export default function Results() {
    const dispatch = useCallback(useDispatch(), []);
    const { edit, ISN_EVENT, STATUS, RESULTS, MREVT_REF_RESULTS } = useSelector((state: State) => state.dialogPlan);
    const ref = useRef<HTMLDivElement>(null);
    useScrollIntoView(ref)
    const [showDialogPasteHref, setShowDialogPasteHref] = useState(false);

    const addHref = (newHref: iMREVT_REF[]) => {
        const uniq = newHref.filter(newH => {
            const comparingNewItem = MREVT_REF_RESULTS.find(oldH => {
                if (oldH._State === _ES.Deleted) return false
                if (oldH.ISN_DOC && oldH.ISN_DOC === newH.ISN_DOC) return true;
                if (oldH.URL && oldH.URL === newH.URL) return true;
                else return false;
            })
            if (comparingNewItem) return false;
            else return true;
        })
        if (!uniq.length) return deloDialogAlert(newHref.length > 1 ? `Ссылки существуют в заметке` : `Ссылка существует в заметке`, 'Дело-Web');
        onChangeMrEvtRefCancel([...MREVT_REF_RESULTS, ...uniq]);
    }

    const onChangeMrEvtRefCancel = (items: iMREVT_REF[]) => {
        dispatch(setMrEvtRefCancel(items));
    }

    const onChangeCancelReason = (cancelReason: string) => {
        dispatch(setCancelReason(cancelReason));
    }

    return (
        <div ref={ref} className={dialogNewPlan.row}>
            <span className={dialogNewPlan.label}>
                {STATUS === StatusTypePlan.CANCELLED && 'Причины отмены:'}
                {STATUS === StatusTypePlan.DONE && 'Итоги:'}
            </span>
            <div className={dialogNewPlan.simpleList}>
                <Icon
                    className={dialogNewPlan.icon}
                    name="addLinkSquare"
                    disabled={!edit}
                    onClick={() => setShowDialogPasteHref(true)}
                />
                <SimpleList
                    isText={true}
                    disabled={!edit}
                    text={RESULTS || ''}
                    maxLength={2000}
                    onChangeText={onChangeCancelReason}
                    items={MREVT_REF_RESULTS}
                    onDelete={(item) => {
                        item._State = _ES.Deleted;
                        onChangeMrEvtRefCancel(MREVT_REF_RESULTS.slice())
                    }}
                    filterDeleted={(item) => item._State !== _ES.Deleted}
                    onChangeItems={addHref}
                    setJSXElement={(item) => item._State !== _ES.Deleted ? <Link backGround={false} href={item} isEdit={false} /> : null}
                />
                <DialogPasteHref
                    REF_KIND_PRJ={'PRJ_RESULT'}
                    REF_KIND_DOC={'DOC_RESULT'}
                    REF_MEETING={'MEETING'}
                    show={showDialogPasteHref}
                    ISN_EVENT={ISN_EVENT}
                    setHref={addHref}
                    showModal={() => setShowDialogPasteHref(false)}
                    disableInput={true}
                />
            </div>
        </div>
    )
}