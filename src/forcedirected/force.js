import * as d3 from "d3";
import './force.css'; 

export const forceDirected = ({displayData, infoDispatch}) => {




    .on("click", function(d) {if (d.tag == 'related')
            refreshInfo(d.name, infoDispatch)
    }


    return (
        <>    
            <svg ref = {ref}/>
        </>
      )
}