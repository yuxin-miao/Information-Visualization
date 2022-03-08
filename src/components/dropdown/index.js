import React, { forwardRef, useState, useImperativeHandle } from "react";

export const Dropdown = forwardRef((props, ref) => {
    const [value, setValue] = useState(props.options ? props.options[0].value : "")
    useImperativeHandle(ref, () => ({
      onChange(event) {
        setValue(event.target.value)
      }
    }))

    const style = {
        fontSize: '.8vw'
    }
  
    return (
      <div className={`${props.className ? props.className : ''} grid grid-cols-5 gap-2`} style={props.style ? {...props.style, ...style} : style} >
        <p className={`${props.pClassName ? props.pClassName : ''} text-white font-ssp font-bold self-center col-span-2`}>{props.label}</p>
        <select
          onChange={props.onChange ? props.onChange : function (event) { setValue(event.target.value) }}
          defaultValue={props.defaultValue ? props.defaultValue : value}
          className={`${props.selectClassName ? props.selectClassName : ''} col-start-3 col-span-full rounded text-center bg-gray-200`}
          name={props.value}
          id={`select-${props.value}`}
        >
          {
            props.options ? 
              props.options.map(val => <option key={`${props.value}-${val.value}`} value={val.value}>{val.label}</option>) :
              <option selected value="">No Selection</option>
          }
        </select>
      </div>
    )
  })