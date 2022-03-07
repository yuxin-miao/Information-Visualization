import React from "react";
import './demo.css';

export const Demo = (props) => {
  return (
    <div className={`${props.className ? props.className : ''} col-span-full font-ssp flex flex-col justify-around px-8` }>
      <div className="circle1 absolute bg-gradient-to-b from-circle1-top to-circle1-bottom"></div>
      <div className="circle2 absolute bg-gradient-to-b from-circle2-top to-circle2-bottom"></div>
      <div className="circle3 absolute bg-gradient-to-b from-circle3-top to-circle3-bottom"></div>
      <div className="circle4 absolute bg-gradient-to-b from-circle4-top to-circle4-bottom"></div>
      <div className="circle5 absolute bg-gradient-to-b from-circle5-top to-circle5-bottom"></div>

    </div>
  )
}