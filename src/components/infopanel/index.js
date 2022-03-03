import './index.css'
import TypeIcon from '../../assets/tvicon.png'
import CalendarIcon from '../../assets/calendaricon.png'
import StudioIcon from '../../assets/studioicon.png'

export const InfoPanel = (props) => {

    return (
        <div className="info-grid w-full h-full font-ssp text-white p-3" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
            <div className='col-start-2 col-span-5 row-span-2 flex h-min justify-center self-center text-center font-bold' style={{ fontSize: '0.8vw' }}>
                <p>{props.animeTitle}</p>
            </div>
            <div className='col-start-1 row-start-1 row-span-2 self-center justify-self-center font-extrabold' style={{ fontSize: '1vw' }}>
                <p>{props.animeRank ? `# ${props.animeRank}` : ''}</p>
            </div>
            <div className='col-start-7 row-start-1 row-span-2 self-center justify-self-center text-red-400 font-extrabold' style={{ fontSize: '1vw' }}>
                <p>{props.animeRating}</p>
            </div>
            <div className='row-start-3 self-center justify-self-center w-full h-full grid grid-cols-5' style={{ fontSize: '0.8vw' }}>
                <img src={TypeIcon} className='object-contain h-min self-center justify-self-center col-span-2' />
                <p className='col-start-3 col-span-full self-center' style={{ marginLeft: '0.25vw' }}>{props.animeType}</p>
            </div>
            <div className='row-start-3 col-start-3 col-span-3 self-center justify-self-center w-full h-full grid grid-cols-7' style={{ fontSize: '0.8vw' }}>
                <img src={CalendarIcon} className='object-contain self-center justify-self-center col-span-2' />
                <p className='col-start-3 col-span-full self-center' style={{ marginLeft: '0.25vw', marginRight: '0.25vw', lineHeight: '1.75vh' }}>{props.animeSeason ? `${props.animeReleaseYear} ${props.animeSeason}` : props.animeReleaseYear}</p>
            </div>
            <div className='row-start-3 col-start-6 col-span-full self-center justify-self-center w-full h-full grid grid-cols-7'>
                <img src={StudioIcon} className='object-contain self-center justify-self-center col-span-2' />
                <p className='col-start-3 col-span-full self-center' style={{ marginLeft: '0.25vw', marginRight: '0.25vw', fontSize: '0.6vw', lineHeight: '1.75vh' }}>{props.animeStudio ? props.animeStudio : ''}</p>
            </div>
            <div className='row-start-4 col-span-full text-justify' style={{ overflowY: "scroll", fontSize: '0.8vw', paddingTop: '0.5vh', paddingRight: '0.5vw' }}>
                <p>{props.animeDescription}</p>
            </div>
            <div className='row-start-5 col-start-2 col-end-7 text-justify' style={{ overflowY: "scroll", fontSize: '0.8vw', paddingTop: '0.8vh', paddingRight: '0.5vw' }}>
                {props.animeVoiceActors.map((v, k) => {
                    return <div key={k} className='grid grid-cols-5 w-full' style={{ marginBottom: '0.8vh' }}>
                        <p className='font-bold col-span-2' style={{ fontSize: '.7vw' }}>{v.role}</p>
                        <p className='col-start-3 col-span-full self-center justify-self-center' style={{ fontSize: '.7vw' }}>{v.name}</p>
                    </div>
                })}
            </div>
            <div className='row-start-6 col-start-2 col-end-7 text-justify' style={{ overflowY: "scroll", fontSize: '0.8vw', paddingTop: '0.8vh', paddingRight: '0.5vw' }}>
                {props.animeStaff.map((v, k) => {
                    return <div key={k} className='grid grid-cols-5 w-full' style={{ marginBottom: '0.8vh' }}>
                        <p className='font-bold col-span-2' style={{ fontSize: '.7vw' }}>{v.role}</p>
                        <p className='col-start-3 col-span-full self-center justify-self-center' style={{ fontSize: '.7vw' }}>{v.name}</p>
                    </div>
                })}
            </div>
        </div>
    )
}