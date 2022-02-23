import { useState } from "react"
import SearchIcon from "../../assets/searchicon.png"
import './index.css'
import { useEffect } from "react"
import RefreshIcon from "../../assets/refresh.png"

/**
 * @props onSubmit
 * @returns a searchbox that accepts one onSubmit prop. onSubmit should be a function that has one parameter event to access the value of the searchbox.
 */

export const SearchBox = ({ className, rawSetData, animeData, handleClickSuggestion}) => {
  const [query, setQuery] = useState('')

  // suggestion format: [{val: '', type: ''}, {val: '', type: ''}, ...]
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [suggestionList, setSuggestionList] = useState([])
  const [submitSearch, setSubmitSearch] = useState(false)
  // set the list of string to be filtered 
  useEffect(() => {
    let itemList = []

    // add AnimeData
    let tempList = animeData
    tempList.forEach(element => {
      itemList.push({val: String(element), type: "anime"})
    })
    // add VA data 
    tempList = rawSetData[4].slice(1)
    tempList.forEach(element => {
      itemList.push({val: String(element), type: "voice actor"})
    });
    // add studio data 
    // tempList = rawSetData[1].slice(1)
    // tempList.forEach(element => {
    //   itemList.push({val: String(element), type: 'studio'})
    // })
    // set the final result 
    setSuggestionList(itemList)
  }, [])
  // handle the input change 
  const handleChange = (event) => {
    setQuery(event.target.value)
    setSubmitSearch(false)
    if (event.target.value) setFilteredSuggestions(availableSuggestoins(event.target.value))
    else setFilteredSuggestions([])
  }
  // filter the suggestions matching user's current search 
  const availableSuggestoins = (searchValue) =>{
    let tmpList = []
    for (let i = 0; i < suggestionList.length; i++) {
      if (suggestionList[i].val.toLowerCase().includes(searchValue.toLowerCase()))
        tmpList.push(suggestionList[i])
      if (tmpList.length === 5) break
    }
    return tmpList
  }
  // render the suggestion list 
  const renderSuggestionList = () => {
    if (query === undefined || query === '' || submitSearch) return null;
    return (
      <ul className="suggestions bg-main absolute inline-block z-10" style={{ width: '31%' }}>
        {filteredSuggestions && filteredSuggestions.length > 0 ?
          (filteredSuggestions.map((suggestion, index) => {
            return (
              <li className="flex justify-between py-2 px-4 text-sm text-gray-100 hover:text-main hover:bg-gray-50" 
                  style={{ fontSize: '.7vw', height: '3vh' }}
                  key={index} 
                  onClick={() => handleClick(suggestion)}>
                <div className="self-center">{suggestion.val}</div>  
                <div className="self-center circle-text px-2"> {suggestion.type}</div>
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
  // handle the event when use click one suggestion in the suggestion list 
  const handleClick = (suggestion) => {
    setQuery(suggestion.val)
    setFilteredSuggestions([])
    handleClickSuggestion(suggestion)
    setSubmitSearch(true)
  }
  const handleOnRefresh = () => {
    setQuery("")
    handleClickSuggestion({
      type: '',
      val: ''
    })
  }

  return (
    <div className={`${className ? className : ''} w-full flex gap-4 p-2 pt-0`}>
      <div className="search-icon flex align-center justify-center"> <img alt={''} src={SearchIcon} className="icon"/> </div>
      
      <div className="input-box justify-center w-full" style={{ fontSize: '.8vw' }}>
        <form className="input-area w-full flex">
          <input
            className="px-3 w-full h-full bg-transparent text-white"
            placeholder="Search for the anime or voice actor"
            style={{ fontFamily: "SourceSansPro" }}
            type="text"
            value={query}
            onChange={handleChange}
          />
          <img onClick={handleOnRefresh} className="w-auto h-full self-center ml-1" src={RefreshIcon}/>     
        </form>

        {renderSuggestionList()}
      </div>
    </div>
  )
}
