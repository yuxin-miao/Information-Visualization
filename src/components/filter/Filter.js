import { useEffect, useState } from "react";
import { parseSetData } from "../../utils/fetchData";

export const Filter = (filterIndex) => {
    let [rawSetData, setRawSetData] = useState([]);
    useEffect(() => {
        parseSetData((result) => {
            setRawSetData(result.data);
        })
    }, [])

    let unique = rawSetData[filterIndex]
    unique = [...new Set(unique)]
    unique.shift()
    unique.sort()
    return unique
}