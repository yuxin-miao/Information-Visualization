import './index.css'
import tvIcon from "../../assets/tv.png"
import studioIcon from "../../assets/studio.png"
import calendarIcon from "../../assets/calendar.png"
export const InfoPanel = (props) => {

    return (
        <div className="info-grid gap-2 w-full h-full font-ssp text-white" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
            <div className='col-start-1  row-start-1 row-span-1 flex h-min justify-start self-center text-center font-bold px-5' style={{ fontSize: '1.5vw', alignSelf:'end' }}>
                <p>#{props.animeRank}</p>
            </div>
            <div className='col-start-3 row-start-2 row-span-1 flex h-min justify-center self-center text-center px-5' style={{ fontSize: '0.8vw' }}>
                <img src={tvIcon} className="col-start-1" style={{alignSelf:'center'}}></img>
                <p className="col-start-2 col-span-2 px-2">{props.animeType}</p>
            </div>
            <div className='col-start-1 row-start-2 row-span-1 col-span-2 flex h-min justify-center self-center text-center px-5' style={{ fontSize: '0.8vw'}}>
                <img src={calendarIcon} className="col-start-1" style={{alignSelf:'center'}}></img>
                <p className="col-start-2 col-span-2 px-2">{props.animeReleaseYear} {props.animeReleaseSeason}</p>
            </div>
            <div className='col-start-4 row-start-2 row-span-1 col-span-2 flex h-min justify-center grid self-center text-center px-5' style={{ fontSize: '0.8vw' }}>
                <img src={studioIcon} className="col-start-1" style={{alignSelf:'center'}}></img>
                <p className="col-start-2 col-span-2 px-2">{props.animeStudio}</p>
            </div>
            <div className='col-start-2 col-span-3 row-start-1 row-span-1 flex h-min justify-center self-center text-center font-bold' style={{ fontSize: '1.5vw', alignSelf:'end' }}>
                <p>{props.animeTitle}</p>
            </div>
            <div className='col-start-5 row-start-1 row-span-1 flex h-min justify-end self-center text-center font-bold px-5' style={{ fontSize: '1.5vw', color: 'red', alignSelf:'end' }}>
                <p>{props.animeRating}</p>
            </div>
            <div className='row-start-3 col-span-full px-5 text-justify' style={{ overflowY: "scroll" }}>
                <p>{props.animeDescription}</p>
            </div>
        </div>
    )
}