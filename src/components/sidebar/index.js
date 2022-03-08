import '../../index.css'
import './index.css'
import Logo from "../../assets/logo.png"
import VisualIcon from "../../assets/visualicon.png"
import AboutIcon from "../../assets/abouticon.png"
import TeamIcon from "../../assets/teamicon.png"
import DemoIcon from "../../assets/demoicon.png"
import AnimeGirl from "../../assets/animegirl.png"
import FilterArrow from "../../assets/filterarrow.png"
import { useState } from 'react'

import { Dropdown } from '../dropdown'
import { Checkbox } from '../checkbox'
import AutoComplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField';

export const Sidebar = (props) => {
    const [isFilterActive, setIsFilterActive] = useState(false)

    return (
        <div className={`${props.className ? props.className : ''} dotted-spaced right side-grid relative pt-4`}>
            <a href='#' className="justify-self-center h-min">
                <img src={Logo} />
            </a>
            <div
                className={`absolute text-white bg-filter-blue font-ssp font-bold flex justify-end filter-header ${isFilterActive ? 'active' : ''}`}
                onClick={_ => setIsFilterActive(!isFilterActive)}
            >
                <div className='flex filter-button'>
                    <p className='self-center' style={{ paddingRight: '.5vw' }}>Filters</p>
                    <img className='self-center' src={FilterArrow} style={{ height: '40%', paddingRight: '.5vw' }} />
                </div>
            </div>
            <div className={`absolute text-white bg-filter-blue rounded-br font-ssp filter-section ${isFilterActive ? 'active' : ''}`}>
                <Dropdown
                    label="X - Axis"
                    value="x-axis"
                    style={{ height: '3vh' }}
                    className="text-black"
                    options={[{ value: 0, label: 'Intersection' }, { value: 1, label: 'Union' }]}
                />
                <Dropdown
                    label="Y - Axis"
                    value="y-axis"
                    style={{ height: '3vh' }}
                    className="text-black"
                    options={[{ value: 0, label: 'Intersection' }, { value: 1, label: 'Union' }]}
                />
                <Dropdown
                    label="Studio"
                    value="studio"
                    style={{ height: '3vh' }}
                    className="text-black"
                    options={[{ value: 0, label: 'Intersection' }, { value: 1, label: 'Union' }]}
                />
                <div className='h-full grid gap-2 grid-cols-5'>
                    <p className='col-span-2'>User Stats</p>
                    <div className='col-start-3 col-span-full grid grid-rows-5'>
                        <Checkbox name="100k" label="100,000 +"></Checkbox>
                        <Checkbox name="50k" label="50,000 +"></Checkbox>
                        <Checkbox name="10k" label="10,000 +"></Checkbox>
                        <Checkbox name="5k" label="5,000 +"></Checkbox>
                        <Checkbox name="1k" label="1,000 +"></Checkbox>
                    </div>
                </div>
                <div className='h-full grid gap-2 grid-cols-7'>
                    <p className='col-span-2'>Type</p>
                    <div className='col-start-3 col-span-3 grid grid-rows-5'>
                        <Checkbox name="100k" label="DVD"></Checkbox>
                        <Checkbox name="50k" label="Movie"></Checkbox>
                        <Checkbox name="10k" label="Video"></Checkbox>
                        <Checkbox name="5k" label="OVA"></Checkbox>
                        <Checkbox name="1k" label="TV Special"></Checkbox>
                    </div>
                    <div className='col-start-6 col-span-full grid grid-rows-5'>
                        <Checkbox name="100k" label="Special"></Checkbox>
                        <Checkbox name="50k" label="Music"></Checkbox>
                        <Checkbox name="10k" label="Web"></Checkbox>
                        <Checkbox name="5k" label="TV"></Checkbox>
                    </div>
                </div>
                <div className='h-full grid gap-2 grid-cols-5'>
                    <p className='col-span-2'>Released Season</p>
                    <div className='col-start-3 col-span-full grid grid-rows-5'>
                        <Checkbox name="100k" label="Spring"></Checkbox>
                        <Checkbox name="50k" label="Summer"></Checkbox>
                        <Checkbox name="10k" label="Fall"></Checkbox>
                        <Checkbox name="5k" label="Winter"></Checkbox>
                    </div>
                </div>
                <div className='w-full flex flex-col' style={{ gap: '1vh' }}>
                    <p>Tags</p>
                    <AutoComplete
                        multiple
                        fullWidth
                        id="size-small-outlined-multi"
                        size="small"
                        options={[{ title: 'The Shawshank Redemption Shawshank Redemption', year: 1994 }, { title: 'The Godfather', year: 1972 }]}
                        getOptionLabel={(option) => option.title}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Search for tags..." />
                        )}
                        sx={{ overflow: 'auto', color: 'white' }}
                    />
                </div>
            </div>
            <div className='grid grid-cols-5 gap-4' style={{ fontSize: '1.2vw' }}>
                <a href='#' className='col-start-2 self-center justify-self-center'>
                    <img src={VisualIcon} />
                </a>
                <div className='col-start-3 col-span-full w-max flex flex-col justify-center'>
                    <a href='#' className='text-white font-ssp h-max'>Visual</a>
                </div>
            </div>
            <div className='grid grid-cols-5 gap-4' style={{ fontSize: '1.2vw' }}>
                <a href='#' className='col-start-2 self-center justify-self-center'>
                    <img src={AboutIcon} />
                </a>
                <div className='col-start-3 col-span-full w-max flex flex-col justify-center'>
                    <a href='#' className='text-white font-ssp h-max'>About</a>
                </div>
            </div>
            <div className='grid grid-cols-5 gap-4' style={{ fontSize: '1.2vw' }}>
                <a href='#' className='col-start-2 self-center justify-self-center'>
                    <img src={TeamIcon} />
                </a>
                <div className='col-start-3 col-span-full w-max flex flex-col justify-center'>
                    <a href='#' className='text-white font-ssp h-max'>Team</a>
                </div>
            </div>
            <div className='grid grid-cols-5 gap-4' style={{ fontSize: '1.2vw' }}>
                <a href='#' className='col-start-2 self-center justify-self-center'>
                    <img src={DemoIcon} />
                </a>
                <div className='col-start-3 col-span-full w-max flex flex-col justify-center'>
                    <a href='#' className='text-white font-ssp h-max'>Demo</a>
                </div>
            </div>

            <img className='h-3/5 self-end justify-self-center object-cover' src={AnimeGirl} />
        </div>
    )
}