import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deloDialogAlert, iMREVT_REF, _ES } from "@eos/mrsoft-core";
import { setReason, setMrEvtRefReason } from "../../../store/dialogPlan/actions";
import SimpleList from "../../../UI/components/SimpleList";
import Icon from "../../../UI/components/Icon";
import { State } from "../../../store";
import Link from "../../../UI/components/Link";

import dialogNewPlan from "../DialogNewPlan.module.scss";
import DialogPasteHref from "../../Sidebar/Notes/ModalWindows/DialogPasteHref";

export default function Reason() {
    const dispatch = useCallback(useDispatch(), []);
    const { edit, dialogCancelled, dialogDone, ISN_EVENT, REASON, MREVT_REF_REASON } = useSelector((state: State) => state.dialogPlan);
    const resultEdit = (dialogCancelled || dialogDone) ? false : edit;
    const [showDialogPasteHref, setShowDialogPasteHref] = useState(false);

    const addHref = (newHref: iMREVT_REF[]) => {
        const uniq = newHref.filter(newH => {
            const comparingNewItem = MREVT_REF_REASON.find(oldH => {
                if (oldH._State === _ES.Deleted) return false
                if (oldH.ISN_DOC && oldH.ISN_DOC === newH.ISN_DOC) return true;
                if (oldH.URL && oldH.URL === newH.URL) return true;
                else return false;
            })
            if (comparingNewItem) return false;
            else return true;
        })
        if (!uniq.length) return deloDialogAlert(newHref.length > 1 ? `Ссылки существуют в заметке` : `Ссылка существует в заметке`, 'Дело-Web');
        onChangeMrEvtRefReason([...MREVT_REF_REASON, ...uniq]);
    }

    const onChangeReason = (reason: string) => {
        dispatch(setReason(reason));
    }

    const onChangeMrEvtRefReason = (items: iMREVT_REF[]) => {
        dispatch(setMrEvtRefReason(items));
    }

    return (
        <div className={dialogNewPlan.row}>
            <span className={dialogNewPlan.label}>Основание создания:</span>
            <div className={dialogNewPlan.simpleList}>
                <Icon
                    className={dialogNewPlan.icon}
                    name="addLinkSquare"
                    title={'Добавить ссылку на РК/РКПД'}
                    disabled={!resultEdit}
                    onClick={() => setShowDialogPasteHref(true)}
                />
                <SimpleList
                    isText={true}
                    disabled={!resultEdit}
                    text={REASON || ''}
                    maxLength={2000}
                    onChangeText={onChangeReason}
                    items={MREVT_REF_REASON}
                    onDelete={(item) => {
                        item._State = _ES.Deleted;
                        onChangeMrEvtRefReason(MREVT_REF_REASON.slice())
                    }}
                    filterDeleted={(item) => item._State !== _ES.Deleted}
                    onChangeItems={addHref}
                    setJSXElement={(item) => <Link backGround={false} href={item} isEdit={false} />}
                />
                <DialogPasteHref
                    REF_KIND_PRJ={'PRJ_RC'}
                    REF_KIND_DOC={'DOC_RC'}
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