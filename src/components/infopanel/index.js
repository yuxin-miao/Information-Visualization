import './index.css'

export const InfoPanel = (props) => {

    return (
        <div className="info-grid gap-2 w-full h-full font-ssp text-white" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
            <div className='col-start-2 col-span-3 row-span-2 flex h-min justify-center self-center text-center font-bold' style={{ fontSize: '1.5vw' }}>
                <p>{props.animeTitle}</p>
            </div>
            <div className='row-start-3'>
                <p>{props.animeDescription}</p>
            </div>
        </div>
    )
}