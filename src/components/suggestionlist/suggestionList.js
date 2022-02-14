export const SuggestionList = ({onClick, suggestions}) => {
  console.log(suggestions)
  return (
    <ul className="suggestions absolute top-10 bg-main">
      {suggestions.map((suggestion, index) => {
        return (
          <li className="block py-2 px-4 text-sm text-gray-100 hover:text-main hover:bg-gray-50" 
              key={index} 
              onClick={onClick}>
            {suggestion}
          </li>
        );
      })}
    </ul>
  )
}