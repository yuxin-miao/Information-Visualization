import { Link, useLocation } from "react-router-dom";

import '../../index.css'
import './index.css'
import Logo from "../../assets/logo.png"
import VisualIcon from "../../assets/visualicon.png"
import AboutIcon from "../../assets/abouticon.png"
import TeamIcon from "../../assets/teamicon.png"
import DemoIcon from "../../assets/demoicon.png"
import AnimeGirl from "../../assets/animegirl.png"
import { useState, useEffect } from "react";


export const Sidebar = (props) => {
    const location = useLocation();
    const sidebarItem = [
    {
        name: 'Visual',
        icon: VisualIcon,
        to: '/'
    },
    {
        name: 'About',
        icon: AboutIcon,
        to: '/about'
    },
    {
        name: 'Team',
        icon: TeamIcon,
        to: '/team'
    },
    {
        name: 'Demo',
        icon: DemoIcon,
        to: '/demo'
    },
    ]
    const [activeIdx, setActiveIdx] = useState(0)
    const onChangeRoute = (index) => {
        setActiveIdx(index)
    }
    useEffect(()=> {
        //Get an item with the same 'route' as the one provided by react router (the current route)
        // changeActiveIndex(activeItem);
        if (sidebarItem[activeIdx] !== location.pathname) {
            for (let i = 0; i < sidebarItem.length; i++) {
                if (sidebarItem[i].to === location.pathname) setActiveIdx(i)
            }
        }
    }, [location])

    return (
        <div className={`${props.className ? props.className : ''} dotted-spaced right side-grid relative pt-4`}>
            <div className="justify-self-center h-min">
                <img className="side-logo" src={Logo} />
            </div>
            {sidebarItem.map((item, index) => {
                return (
                    <Link to={item.to} className={`grid grid-cols-5 ${activeIdx === index ? 'opacity-100' : 'opacity-60'}`} style={{ fontSize: '1.2vw' }} onClick={() => onChangeRoute(index)} key={index}>
                        <div className='col-start-2 self-center justify-self-center'>
                            <img alt="" src={item.icon} style={{ width: "1.5vw"}} />
                        </div>
                        <div className='col-start-3 col-span-full w-max flex flex-col justify-center'>
                            <div className='text-white font-ssp h-max'>{item.name}</div>
                        </div>
                    </Link>
                )
            })}
            <img className='h-3/5 self-end justify-self-center object-cover' src={AnimeGirl} />
        </div>
    )
}