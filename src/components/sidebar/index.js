import '../../index.css'
import './index.css'
import Logo from "../../assets/logo.png"
import VisualIcon from "../../assets/visualicon.png"
import AboutIcon from "../../assets/abouticon.png"
import TeamIcon from "../../assets/teamicon.png"
import DemoIcon from "../../assets/demoicon.png"
import AnimeGirl from "../../assets/animegirl.png"

export const Sidebar = (props) => {
    const LogoStyle = {
        backgroundImage: `url(${Logo})`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `center`,
        backgroundSize: `auto`,
        width: `100%`,
        height: `50%`
    }
    const AnimeGirlStyle = {
        backgroundImage: `url(${AnimeGirl})`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `center`,
        backgroundSize: `auto`,
        width: `100%`,
        height: `auto`
    }
    const IconStyle = {
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `center`,
        backgroundSize: `auto`,
        width: `100%`,
        height: `100%`
    }

    return (
        <div className={`${props.className ? props.className : ''} dotted-spaced right side-grid relative pt-4`}>
            <a href='#' className="justify-self-center h-min">
                <img src={Logo} />
            </a>
            <div className='grid grid-cols-5 gap-4'>
                <a href='#' className='col-start-2 self-center justify-self-center'>
                    <img src={VisualIcon} />
                </a>
                <div className='col-start-3 col-span-full w-max flex flex-col justify-center'>
                    <a href='#' className='text-white font-ssp text-xl h-max'>Visual</a>
                </div>
            </div>
            <div className='grid grid-cols-5 gap-4'>
                <a href='#' className='col-start-2 self-center justify-self-center'>
                    <img src={AboutIcon} />
                </a>
                <div className='col-start-3 col-span-full w-max flex flex-col justify-center'>
                    <a href='#' className='text-white font-ssp text-xl h-max'>About</a>
                </div>
            </div>
            <div className='grid grid-cols-5 gap-4'>
                <a href='#' className='col-start-2 self-center justify-self-center'>
                    <img src={TeamIcon} />
                </a>
                <div className='col-start-3 col-span-full w-max flex flex-col justify-center'>
                    <a href='#' className='text-white font-ssp text-xl h-max'>Team</a>
                </div>
            </div>
            <div className='grid grid-cols-5 gap-4'>
                <a href='#' className='col-start-2 self-center justify-self-center'>
                    <img src={DemoIcon} />
                </a>
                <div className='col-start-3 col-span-full w-max flex flex-col justify-center'>
                    <a href='#' className='text-white font-ssp text-xl h-max'>Demo</a>
                </div>
            </div>
            <img className='h-3/5 self-end justify-self-center' src={AnimeGirl} />
        </div>
    )
}