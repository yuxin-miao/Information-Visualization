import React from "react";
import './demo.css';

export const Demo = (props) => {
  return (
    <div className={`${props.className ? props.className : ''} col-span-full font-ssp flex flex-col justify-around px-8` }>
      <div className="circle01 absolute bg-gradient-to-b from-circle1-top to-circle1-bottom"></div>
      <div className="circle02 absolute bg-gradient-to-b from-circle2-top to-circle2-bottom"></div>
      <div className="circle03 absolute bg-gradient-to-b from-circle3-top to-circle3-bottom"></div>
      <div className="circle04 absolute bg-gradient-to-b from-circle4-top to-circle4-bottom"></div>
      <div className="circle05 absolute bg-gradient-to-b from-circle5-top to-circle5-bottom"></div>

    </div>
  )
}