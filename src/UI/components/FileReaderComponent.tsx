import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deloDialogAlert, EntityHelper, iMREVT_EVENT, Piper, SequenceMap, _ES } from "@eos/mrsoft-core";
import { loadNotes } from "../../store/calendar/actions";
import { iICS } from "../../Dictionary/Interfaces";
import { State } from "../../store/index";
import S from "../../values/Strings";

import format from "date-fns/format";
import componentReaderFile from "../styles/FileReaderComponent.module.scss";

interface iProps {
  type: string;
  text: string;
  setLoader: Function;
}

export default function FileReaderComponent(props: iProps) {
  const dispatch = useDispatch();
  const { type, text, setLoader } = props;
  const { PageContext } = useSelector((state: State) => state.common);

  const separate = "&#59"; // отсечка до которой обрезать строки

  const makeCorrectDate = (value: string) => {
    const sliceString = (start: number, end: number) => value.substring(start, end);

    const year = sliceString(0, 4), month = sliceString(4, 6),
      day = sliceString(6, 8), hour = sliceString(9, 11),
      minute = sliceString(11, 13), second = sliceString(13, 15);

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }

  const cutValueFromKey = (data: string, key: string) => {
    const fieldValidateString = ["LOCATION:", "DESCRIPTION:"];

    const startPos = data.indexOf(key) + key.length;
    const endPos = data.indexOf(separate, startPos);
    let value: string = data.substring(startPos, endPos).trim();

    if (~fieldValidateString.indexOf(key)) {
      value = value.replaceAll("\n", "\n").replaceAll("\\n", "\n") || "";
    }

    // проверка на валидность даты и приведение ее к валидному виду
    if (key === "DTSTART:") {
      const regex = /\d{8}T\d{6}/g;
      const isReg = regex.test(value);
      value = isReg ? new Date(makeCorrectDate(value)).toString() : new Date().toString();
    }

    return value;
  }

  const makeObjISC = (line: string): iICS[] => {
    let startPos = -1;
    const icsString: string[] = [];
    const maskStart = "BEGIN:VEVENT", maskEnd = "END:VEVENT";

    // получаем заметки из файла и строим массив строк
    while ((startPos = line.indexOf(maskStart, startPos + 1)) !== -1) {
      const endPos = line.indexOf(maskEnd, startPos) + maskEnd.length;
      const foundValue = line.substring(startPos, endPos).replace(/\n/g, separate);
      icsString.push(foundValue);
    }

    // формируем объект из полученных данных
    const icsObj: iICS[] = icsString.map(str => {
      return ({
        SUMMARY: cutValueFromKey(str, "SUMMARY:"),
        DTSTART: cutValueFromKey(str, "DTSTART:"),
        LOCATION: cutValueFromKey(str, "LOCATION:"),
        DESCRIPTION: cutValueFromKey(str, "DESCRIPTION:"),
      })
    })

    return icsObj;
  };

  const handleFile = async (event: ProgressEvent<FileReader>) => {
    const content = event.target?.result as string;
    const objICS = makeObjISC(content);
    const eventToSave = objICS.map(ics => {
      return EntityHelper.createEntity<iMREVT_EVENT>("MREVT_EVENT", {
        ISN_EVENT: SequenceMap.getTempIsn(),
        EVENT_TYPE: 0,
        DUE_DEPARTMENT: PageContext?.CurrentUser.DUE_DEP,
        IS_PERSONAL: 1,
        STATUS: 1,
        IS_COMMON: 1,
        BODY: ics.SUMMARY + "\n" + ics.DESCRIPTION,
        EVENT_DATE: format(new Date(ics.DTSTART), "yyyy-MM-dd'T'HH:mm:ss"),
        PLACE: ics.LOCATION,
        TITLE: ics.SUMMARY,
        _State: _ES.Added,
      })
    })

    await Piper.save(...eventToSave);
    dispatch(loadNotes());
    setLoader(false);
    deloDialogAlert(S.messageImportSuccess, 'Дело-Web');
  }

  const errorShow = (event: ProgressEvent<FileReader>) => {
    setLoader(false);
    deloDialogAlert(`При импорте файла возникла следующая ошибка: ${event.target?.error}`);
  }

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileData = new FileReader();
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    setLoader(true);
    fileData.onloadend = handleFile;
    fileData.onerror = errorShow;
    fileData.readAsText(file as Blob);
  }

  return (
    <div className={componentReaderFile.fileUpload}>
      <label>
        <input value="" type="file" accept={`.${type}`} name="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeFile(e)} />
        <span>{text}</span>
      </label>
    </div>
  );
}