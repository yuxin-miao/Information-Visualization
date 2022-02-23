import './index.css'
import TypeIcon from '../../assets/tvicon.png'
import CalendarIcon from '../../assets/calendaricon.png'
import StudioIcon from '../../assets/studioicon.png'

export const InfoPanel = (props) => {

    return (
        <div className="info-grid w-full h-full font-ssp text-white p-3" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
            <div className='col-start-2 col-span-5 row-span-2 flex h-min justify-center self-center text-center font-bold' style={{ fontSize: '1.2vw' }}>
                <p>{props.animeTitle}</p>
            </div>
            <div className='col-start-1 row-start-1 row-span-2 self-center justify-self-center font-extrabold' style={{ fontSize: '1.3vw' }}>
                <p>{props.animeRank ? `# ${props.animeRank}` : ''}</p>
            </div>
            <div className='col-start-7 row-start-1 row-span-2 self-center justify-self-center text-red-400 font-extrabold' style={{ fontSize: '1.5vw' }}>
                <p>{props.animeRating}</p>
            </div>
            <div className='row-start-3 self-center justify-self-center flex gap-2' style={{ fontSize: '1vw' }}>
                <img src={TypeIcon} className='w-full object-contain' />
                <p>{props.animeType}</p>
            </div>
            <div className='row-start-3 col-start-3 col-span-3 self-center justify-self-center flex gap-2' style={{ fontSize: '.8vw' }}>
                <img src={CalendarIcon} className='h-full object-contain self-center' />
                <p>{props.animeSeason ? `${props.animeReleaseYear} ${props.animeSeason}` : props.animeReleaseYear}</p>
            </div>
            <div className='row-start-3 col-start-6 col-span-full self-center justify-self-center flex gap-2' style={{ fontSize: '1vw' }}>
                <img src={StudioIcon} className='h-full object-contain self-center' style={{ width: '15%' }} />
                <p>{props.animeStudio ? props.animeStudio : ''}</p>
            </div>
            <div className='row-start-4 col-span-full px-5 my-2 text-justify' style={{ overflowY: "scroll", fontSize: '1vw' }}>
                <p>{props.animeDescription}</p>
            </div>
        </div>
    )
}