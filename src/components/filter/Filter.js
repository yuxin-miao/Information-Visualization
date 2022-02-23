import { useEffect, useState } from "react";
import { parseSetData } from "../../utils/fetchData";

export const Filter = (filterIndex) => {
    let [rawSetData, setRawSetData] = useState([]);
    useEffect(() => {
        parseSetData((result) => {
        setRawSetData(result.data);
        })
    }, [])

    // let optionList = []
    let unique = rawSetData[filterIndex]
    unique = [...new Set(unique)]
    unique.filter(index => index > 0)
    unique.sort()
    // if it is contentWarning, the last element of the array is blank. Change it to "No"
    // if (filterIndex === 3) {
    //     for (let i = unique.length-1; i > 0; i--) {
    //         unique[i] = unique[i-1]
    //     }
    //     unique[0] = "No"
    // }
    // console.log(unique.length)
    return unique
    // unique.forEach(e => {
    //     if (e != null){
    //         optionList.push({value: e, label: e})
    //     }
    // });
    // console.log(optionList);
    // return optionList
}