import { useRef, useState } from "react"
import SearchIcon from "../../assets/searchicon.png"
import './index.css'

/**
 * @props onSubmit
 * @returns a searchbox that accepts one onSubmit prop. onSubmit should be a function that has one parameter event to access the value of the searchbox.
 */
export const SearchBox = (props) => {
    const [value, setValue] = useState('')

    return (
        <div className={`${props.className ? props.className : ''} w-full flex gap-4 p-2`}>
            <img src={SearchIcon} />
            <form className="w-full" onSubmit={props.onSubmit}>
                <input
                    className="px-3 w-full h-full bg-transparent text-white"
                    style={{ fontFamily: "SourceSansPro" }}
                    placeholder="Search for the anime, studio or voice actor"
                    type="text"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
            </form>
        </div>
    )
}