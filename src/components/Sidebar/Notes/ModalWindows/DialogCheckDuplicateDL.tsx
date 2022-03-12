import React from "react";
import { DeloDialog, DM } from "@eos/mrsoft-core";
import modal from "./ModalWindow.module.scss"

interface iProps {
    show: boolean;
    saveNote: Function;
    showModal?: Function;
    duplicatePersons: string[];
}

export default function DialogCheckDuplicateDL(props: iProps) {
    const { show, showModal, saveNote, duplicatePersons } = props

    const showDL = (item: string) => {
        const user = DM.get("DEPARTMENT", item);
        return (
            <span key={item}>{`${user.SURNAME} - ${user.DUTY}`}</span>
        )
    }

    return (
        <DeloDialog
            show={show}
            onClose={showModal}
            title="Время заметки на эту дату уже занято у следующих должностных лиц:"
            config={{
                actions: [
                    {
                        name: "Продолжить",
                        marked: true,
                        click: () => {
                            saveNote()
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
                        <div className={modal.main}>
                            {duplicatePersons.map(x => showDL(x))}
                        </div>
                    </div>
                ),
                width: 620
            }} />

    )
}