import { useState } from "react";
import { ArrayPath, Control, FieldValues, useFieldArray } from 'react-hook-form';
import { ReactSortable } from "react-sortablejs";

interface fieldsProps {
    id: number;
    [key: string]: string | number;
}

interface childProps<T extends FieldValues> {
    data: object | object[] | null
    index: number
    removeField: Function
    addField?: Function
    fieldControl: Control<T>
}

interface contentProps {
    addField: Function
    fieldsState: fieldsProps[]
}

type props<T extends FieldValues> = {
    fieldControl: Control<T>;
    fieldName: ArrayPath<T>;
    children: (props: childProps<T>) => JSX.Element
    endContent?: (props: contentProps) => JSX.Element;
    startContent?: (props: contentProps) => JSX.Element;
    fieldsNumber?: number
}


function SortableFields<T extends FieldValues>({ fieldControl, fieldName, children, endContent, startContent, fieldsNumber = 0 }: props<T>) {

    const { fields, append, remove, update, move, swap } = useFieldArray({
        control: fieldControl,
        name: fieldName
    });

    let fieldsNumberArray: fieldsProps[] = []

    for (let i = 1; i <= fieldsNumber; i++) {
        fieldsNumberArray.push({ id: i })
    }


    // for sortable and input fields
    const [fieldsState, setFields] = useState<fieldsProps[]>(fieldsNumberArray)

    function addField() {
        let id = 1;
        //a loop to check if the ID already exists, it should avoid it any already existing id, to avoid field adding/deleting bugs
        while (fieldsState.some(data => data.id === id)) {
            id++;
        }
        setFields(prevData => [...prevData, { id: id }]);
    }

    function removeField(index: number) {
        const newArray = fieldsState.filter((_, i) => i !== index);
        setFields(newArray);
        remove(index);
    }

    // To reSort the submitted list whenever we resort with restortable js 
    const reSortingForm = ({ oldIndex, newIndex }: any | number) => {
        move(oldIndex, newIndex);
    };

    return (
        <>
            {startContent && startContent({ addField, fieldsState })}
            <ReactSortable list={fieldsState} setList={setFields} onEnd={reSortingForm} animation={100} ghostClass="bg-white/10">
                {fieldsState.map((data, index) => (
                    <div key={data.id}>
                        {children({ data, index, removeField, addField, fieldControl })}
                    </div>
                ))}
            </ReactSortable>
            {endContent && endContent({ addField, fieldsState })}
        </>
    )
}


export default SortableFields;
