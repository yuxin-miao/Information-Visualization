import { useRef, useState } from "react"
import SearchIcon from "../../assets/searchicon.png"
import './index.css'

/**
 * @props onSubmit
 * @returns a searchbox that accepts one onSubmit prop. onSubmit should be a function that has one parameter event to access the value of the searchbox.
 */
export const SearchBox = (props) => {
    const [value, setValue] = useState('')
    const inputRef = useRef(null)

    const SearchIconStyle = {
        backgroundImage: `url(${SearchIcon})`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `center`,
        backgroundSize: `auto 3vh`,
        width: `4vh`,
        height: `4vh`
    }
    const SearchBoxContainerStyle = {
        maxHeight: `4vh`
    }

    return (
        <div className="flex gap-4 p-2">
            <div className="w-auto h-full" style={SearchBoxContainerStyle}>
                <div className="" style={SearchIconStyle}></div>
            </div>
            <form className="w-96 rounded-lg focus:bg-red-200" onSubmit={props.onSubmit}>
                <input
                    ref={inputRef}
                    className="px-3 w-full h-full bg-transparent text-white"
                    placeholder="Search for the anime, studio or voice actor"
                    type="text"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
            </form>
        </div>
    )
}