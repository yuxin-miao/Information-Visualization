import { Link } from "react-router-dom";

import '../../index.css'
import './index.css'
import Logo from "../../assets/logo.png"
import VisualIcon from "../../assets/visualicon.png"
import AboutIcon from "../../assets/abouticon.png"
import TeamIcon from "../../assets/teamicon.png"
import DemoIcon from "../../assets/demoicon.png"
import AnimeGirl from "../../assets/animegirl.png"

export const Sidebar = (props) => {

    return (
        <div className={`${props.className ? props.className : ''} dotted-spaced right side-grid relative pt-4`}>
            <a href='#' className="justify-self-center self-center h-min">
                <img src={Logo} className="object-contain" style={{ height: '3vw' }} />
            </a>
            <div className='grid grid-cols-5 gap-4' style={{ fontSize: '1.2vw' }}>
                <Link to="/" className='col-start-2 self-center justify-self-center'>
                    <img src={VisualIcon} />
                </Link>
                <div className='col-start-3 col-span-full w-max flex flex-col justify-center'>
                    <Link to="/" className='text-white font-ssp h-max'>Visual</Link>
                </div>
            </div>
            <div className='grid grid-cols-5 gap-4' style={{ fontSize: '1.2vw' }}>
                <Link to="/about" className='col-start-2 self-center justify-self-center'>
                    <img src={AboutIcon} />
                </Link>
                <div className='col-start-3 col-span-full w-max flex flex-col justify-center'>
                    <Link to="/about" className='text-white font-ssp h-max'>About</Link>
                </div>
            </div>
            <div className='grid grid-cols-5 gap-4' style={{ fontSize: '1.2vw' }}>
                <Link to="/team" className='col-start-2 self-center justify-self-center'>
                    <img src={TeamIcon} />
                </Link>
                <div className='col-start-3 col-span-full w-max flex flex-col justify-center'>
                    <Link to="/team" className='text-white font-ssp h-max'>Team</Link>
                </div>
            </div>
            <div className='grid grid-cols-5 gap-4' style={{ fontSize: '1.2vw' }}>
                <Link to="/demo" className='col-start-2 self-center justify-self-center'>
                    <img src={DemoIcon} />
                </Link>
                <div className='col-start-3 col-span-full w-max flex flex-col justify-center'>
                    <Link to="/demo" className='text-white font-ssp h-max'>Demo</Link>
                </div>
            </div>

            <img className='h-3/5 self-end justify-self-center object-cover' src={AnimeGirl} />
        </div>
    )
}