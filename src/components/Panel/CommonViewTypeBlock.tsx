import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../UI/components/Button";
import ButtonGroup from "../../UI/components/ButtonGroup";
import { State } from "../../store";
import { setCommonViewType } from "../../store/common/actions";
import { useWindowSize } from "../../Utils/CalendarHelper";
import { setEdit, setShow, resetPlan } from "../../store/dialogPlan/actions";

import panel from "./Panel.module.scss"

export default function CommonViewTypeBlock() {
    const dispatch = useDispatch();
    const commonViewType = useSelector((state: State) => state.common.commonViewType);
    const shortView = useWindowSize().width < 1300;
    const onClickNewDialog = () => {
        dispatch(setShow(true));
        dispatch(setEdit(true));
        dispatch(resetPlan())
    }
    return (
        <div className={panel.buttonGroup}>
            <ButtonGroup>
                <Button
                    text="Календарь"
                    onClick={() => dispatch(setCommonViewType('calendar'))}
                    isActive={commonViewType === 'calendar'}
                    styles={{ width: 85, height: 25, padding: 0 }}
                />
                <Button
                    text="План"
                    onClick={() => dispatch(setCommonViewType('plan'))}
                    isActive={commonViewType === 'plan'}
                    styles={{ width: 85, height: 25, padding: 0 }}
                />
            </ButtonGroup>
            {commonViewType === 'plan' &&
                <Button
                    title="Создать пункт плана"
                    text={shortView ? '+' : "Создать пункт плана"}
                    onClick={onClickNewDialog}
                    styles={{ height: 25, padding: '0px 10px', marginLeft: 10 }}
                />
            }
        </div>
    );
}