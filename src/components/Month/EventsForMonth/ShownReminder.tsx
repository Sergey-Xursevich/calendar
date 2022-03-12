import React from "react";
import { isSameDay } from "date-fns";
import { iREMINDER, ToolTip } from "@eos/mrsoft-core";

import S from "../../../values/Strings";
import Icon from "../../../UI/components/Icon";
import ToolTipElement from "./TooltipElement";

interface iProps {
  reminders: iREMINDER[];
  date: Date;
}

export default function ShownReminder({ reminders, date }: iProps) {
  const isShowReminder = reminders.some(remind => isSameDay(new Date(remind.INS_DATE || 0), date));

  if (isShowReminder) {
    return (
      <ToolTip position='bottom-end' element={<ToolTipElement text={S.textTooltipReminderIcon} />}>
        <Icon name="reminder" width="22px" height="24px" />
      </ToolTip>
    )
  } else {
    return null;
  }
}
