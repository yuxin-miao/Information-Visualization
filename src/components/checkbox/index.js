export const Checkbox = (props) => {
    return (
      <div className={`${props.className ? props.className : ''} justify-self-center flex w-full gap-2`}>
        <input className="self-center" type='checkbox' id={`checkbox-${props.name}`} name={`${props.name}`} checked={props.checked}  onChange={props.onChange} />
        <label className="self-center text-xs">{props.label}</label>
      </div>
    )
  }