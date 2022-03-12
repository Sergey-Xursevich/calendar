import React, { useEffect, useRef, useState } from "react";
import { Classif, DM, Piper } from "@eos/mrsoft-core";
import Icon from "../Icon";
import Config, { SopInterface, Entity, EntityInterface } from "./Config";
import cl from "classnames";

import blue from "./Blue.module.scss";

interface iProps {
    entity: Entity;
    value: string;
    onChange: (item: string) => void;
    disabled?: boolean;
    placeholder?: string
    className?: string;
    multi?: boolean;
    entityUnified?: string;
    icon?: boolean;
    // setString?: (item: T) => string
    // setElement?: (item: T) => JSX.Element;
}

export default function Blue(props: iProps) {
    const { value, disabled, entity, onChange, placeholder, className, multi, icon } = props;
    const config = Config(entity);
    useEffect(() => {
        if (value) config.loader(value).then(() => {
            setInputValue(DM.get(config.tableName, value, 'CLASSIF_NAME'))
        });
    }, [value, config])
    const [searchData, setSearchData] = useState<SopInterface[] | null>(null);
    const [inputValue, setInputValue] = useState(value ? DM.get(config.tableName, value, 'CLASSIF_NAME') : '');
    const [disableInput, setDisableInput] = useState(value ? true : false);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const ref = useRef<HTMLDivElement>(null)
    useOutsideClickListener(ref.current, () => { setSearchData(null) })
    const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        const searchString = e.target.value;
        if (searchString.length < 3) setSearchData(null);
        else {
            const result = await Piper.load<SopInterface[]>(config.sopName, { args: { Text: encodeURI(searchString), OnlyFIO: 0 } })
            setSearchData(result);
            return result;
        }
    }

    const itemOnClickHandler = (item: SopInterface | EntityInterface) => {
        if (!multi) {
            setDisableInput(true);
            setInputValue(DM.get(config.tableName, config.returnValue(item), 'CLASSIF_NAME'));
            setSearchData(null);
            onChange(config.returnValue(item));
        }
        else {
            setInputValue('');
            setSearchData(null);
            onChange(config.returnValue(item));
        }
    }

    const clearButtonOnClickHandler = () => {
        if (multi) {
            setInputValue('');
            return
        }
        if (disabled) return;
        onChange('');
        setDisableInput(false);
        setSearchData(null);
        setInputValue('');
    }

    const openClassif = async () => {
        if (disabled) return;
        const classifResult = await Classif.open(entity, { multi, nodes: false });
        if (!classifResult) return;
        const data = await config.loader(classifResult)
        itemOnClickHandler(data);
    }

    const inputOnKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        //поиск в result идеального совпадения 
        const perfectMatch = searchData?.filter(item => DM.get(config.tableName, config.returnValue(item), 'CLASSIF_NAME')?.toLowerCase() === inputValue.toString().toUpperCase());

        if (e.keyCode === 13) {
            if (!inputValue.length) {
                //энтер на пустом поле
            } else {
                if (searchData?.length === 1) {
                    itemOnClickHandler(searchData[0]) //энтер при одном итеме
                } else {
                    if (typeof selectedItem === 'number' && searchData?.length) {
                        itemOnClickHandler(searchData?.[selectedItem]); //энтер при одном итеме
                    }
                    else if (perfectMatch?.length === 1) {
                        itemOnClickHandler(perfectMatch[0]); //если итемов нескольно, ни один не выбран, но есть полное совпадение по имени
                    }
                    else {
                        //если их несколько и ни один не выбран открываем справочник
                        // this.openSearchCl(this.currentCl, inputValue).then((ids) => {
                        //     let loaders = [];
                        //     ids.forEach(id => loaders.push(this.invokeLoadAssets(id)));
                        //     waitAll(loaders).then(() => {
                        //         this.afterSuccessfulInsertion(tag, ids);
                        //     });
                        // });
                    }
                }
            }
            e.preventDefault();
        } else if (e.keyCode === 38) {
            if (!searchData?.length) return;
            if (selectedItem === null) setSelectedItem(0);
            else {
                if (selectedItem === 0) setSelectedItem(searchData.length - 1);
                else setSelectedItem(selectedItem - 1)
            }
            e.preventDefault();
        } else if (e.keyCode === 40 && searchData?.length) {
            if (!searchData?.length) return;
            if (selectedItem === null) setSelectedItem(0);
            else {
                if (searchData.length - 1 > selectedItem) setSelectedItem(selectedItem + 1)
                else setSelectedItem(0)
            }
            e.preventDefault();
        } else if (e.keyCode === 37 || e.keyCode === 39) {
            //ничего не делаем, чтобы поиск не перезапускался по кнопкам "влево" и "вправо", так не будет слетать выделение
        } else if (e.keyCode === 9) {
            setSearchData(null); //tab - если с поля ушли табом, убираем выпадаку.
        }
        if (e.keyCode === 27) e.preventDefault();
    }

    return (
        <div ref={ref} className={cl(blue.blue, className)} >
            <input
                className={blue.input}
                disabled={disableInput}
                placeholder={placeholder}
                type="text"
                onChange={onChangeHandler}
                value={inputValue}
                onKeyDown={inputOnKeyPress}
                onFocus={onChangeHandler}
            />
            <span className={blue.inputPlus}>+</span>
            {inputValue.length > 0 && <Icon disabled={disabled} name="cross" className={blue.clearButton} onClick={clearButtonOnClickHandler} />}
            {icon && <Icon disabled={disabled} name="down" className={blue.openClassif} onClick={openClassif} />}
            {searchData && (
                <div className={blue.dropDown}>
                    {searchData.length === 0 && <span>Ничего не найдено</span>}
                    {searchData.map((item, index) => (
                        <div key={index} className={`${blue.dropDownItem}${index === selectedItem ? ` ${blue.selected}` : ''}`} >
                            <div onClick={() => itemOnClickHandler(item)} >
                                {config.template(item)}
                                {/* {setElement && setElement(item)} */}
                                {/* {!setElement && DM.get(config.tableName, value, 'CLASSIF_NAME')} */}
                                {/* {DM.get(config.tableName, config.returnValue(item), 'CLASSIF_NAME')} */}
                            </div>
                        </div>)
                    )}
                </div>
            )}
        </div>
    )
}


const useOutsideClickListener = (ref: HTMLDivElement | null, setOpen: (isOpen: { isOpen: boolean }) => void) => {
    function handleClickOutside(event: MouseEvent) {
        if (!ref) return;
        if (!ref.contains(event.target as Node)) setOpen({ isOpen: false });
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });
}
