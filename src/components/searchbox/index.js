import { useRef, useState } from "react"
import SearchIcon from "../../assets/searchicon.png"
import './index.css'
import { useEffect } from "react"

/**
 * @props onSubmit
 * @returns a searchbox that accepts one onSubmit prop. onSubmit should be a function that has one parameter event to access the value of the searchbox.
 */

export const SearchBox = ({ className, onSubmit, rawSetData, animeData, handleClickSuggestion}) => {
  const [query, setQuery] = useState('')
 
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [suggestionList, setSuggestionList] = useState([])
  const [submitSearch, setSubmitSearch] = useState(false)

  useEffect(() => {
    let itemList = []
    let tempList = animeData.slice(1)
    tempList.forEach(element => {
      itemList.push(String(element))
    })

    tempList = rawSetData[4].slice(1)
    tempList.forEach(element => {
      itemList.push(String(element))
    });

    tempList = rawSetData[1].slice(1)
    tempList.forEach(element => {
      itemList.push(String(element))
    })
    setSuggestionList(itemList)
  }, [])

  const handleChange = (event) => {
    setQuery(event.target.value)
    setSubmitSearch(false)
    if (event.target.value) setFilteredSuggestions(availableSuggestoins(event.target.value))
    else setFilteredSuggestions([])
  }

  const availableSuggestoins = (searchValue) =>{
    let tmpList = []
    for (let i = 0; i < suggestionList.length; i++) {
      if (suggestionList[i].toLowerCase().includes(searchValue.toLowerCase()))
        tmpList.push(suggestionList[i])
      if (tmpList.length === 5) break
    }
    return tmpList
  }

  const renderSuggestionList = () => {
    if (query === undefined || query === '' || submitSearch) return null;
    return (
      <ul className="suggestions bg-main w-1/2 absolute inline-block z-10">
        {filteredSuggestions && filteredSuggestions.length > 0 ?
          (filteredSuggestions.map((suggestion, index) => {
            return (
              <li className="py-2 px-4 text-sm text-gray-100 hover:text-main hover:bg-gray-50" 
                  key={index} 
                  onClick={() => handleClick(suggestion)}>
                {suggestion}
              </li>
            );
          })) : 
            <li className="py-2 px-4 text-sm text-gray-100">
              there are not related things
            </li>
        }
      </ul>
    );
  }

  const handleClick = (suggestion) => {
    setQuery(suggestion)
    setFilteredSuggestions([])
    handleClickSuggestion(suggestion)
    setSubmitSearch(true)
  }

  return (
    <div className={`${className ? className : ''} w-full flex gap-4 p-2 pt-0`}>
      <div className="search-icon flex align-center justify-center"> <img alt={''} src={SearchIcon} className="icon"/> </div>
      
      <div className="input-box justify-center w-full">
        <form className="input-area w-ful" onSubmit={onSubmit}>
          <input
            className="px-3 w-full h-full bg-transparent text-white"
            placeholder="Search for the anime, studio or voice actor"
            style={{ fontFamily: "SourceSansPro" }}
            type="text"
            value={query}
            onChange={handleChange}
          />
        </form>

        {renderSuggestionList()}
      </div>
    </div>
  )
}
