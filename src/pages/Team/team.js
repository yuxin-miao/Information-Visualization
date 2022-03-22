import React from "react";
import { useState } from "react";
import './team.css';
import TeamLogo from '../../assets/team/teamtitle.png';
import NameTitle from '../../assets/team/nametitle.png';
import Harits from '../../assets/team/harits.png';
import Jenny from '../../assets/team/jenny.png';
import Qinbai from '../../assets/team/qinbai.png';
import Ryan from '../../assets/team/ryan.png';
import Xinmiao from '../../assets/team/xinmiao.png';


export const Team = (props) => {
  const [displayInfo, setDisplayInfo] = useState(2)
  const infoIdx = [Harits, Jenny, Qinbai, Ryan, Xinmiao]
  const [photos, setPhotos] = useState([
    {
    name: Harits,
    direction: 0
  },
  {
    name: Jenny,
    direction: 1
  },
  {
    name: Qinbai,
    direction: 2
  },
  {
    name: Ryan,
    direction: 3
  },
  {
    name: Xinmiao,
    direction: 4
  }])
  
  const onClickPhoto = (index) => {
    setDisplayInfo(infoIdx.indexOf(photos[index].name))
    const tempPhotos = photos.slice(index-2).concat(photos.slice(0,index-2))
    setPhotos(tempPhotos)

  }

  return (
    <div className={`${props.className ? props.className : ''} col-span-full font-ssp` }>
      <div className="team w-full h-full flex flex-col space-around"> 
        <div className="team-logo justify-self-center self-center h-min">
          <img alt='' src={TeamLogo} style={{ height: '6.5vw' }} />
        </div>
        <div className="team-member absolute">
          {photos.map((item, index) => {
            return (
                <div className={`team-member-${index} absolute h-full`}  key={index} onClick={() => onClickPhoto(index)}>         
                  <img alt='' className="h-full" src={item.name} style={{ cursor: "pointer" }}/>
                </div>
              )
          })}
        </div>
        <div className="member-info absolute">
          <Info displayOne={displayInfo}/>
        </div>
      </div>
    </div>
  )
}

const Info = (props) => {
  const memberInfos = [
    {
      'name': 'Harits Nur Fauzan',
      'mail': 'mhnf@kth.se',
      'distribution': 'React, D3.js, and CI/CD',
      'anime': 'Monogatari Series and Nichijou',
      'intro': 'I am responsible for the styling and implementing the design of the website, and I also helped with deploying the application. My background is in computer science and I have work experience as a software engineer. My interest is in game development and computer graphics.'
    },
    {
      'name': 'Kwan Mei Wong',
      'mail': 'kmwong@kth.se',
      'distribution': 'React and Testing',
      'anime': 'School Babysitters',
      'intro': 'I am responsible for frontend development. I mainly work with React.js to build different anime filters, e.g. x and y axis, studio, types and content warnings filters. I learnt how to use React.js from this project.'
    },
    {
      'name': 'Qinbai',
      'mail': 'baiq@kth.se',
      'distribution': 'React, Data Scraping, and D3.js',
      'anime': 'Attack on Titan',
      'intro': 'I like anime, movies and gaming. I have a software engineering background and made several games with Unity before. This is my first time getting into web development. I dealt with data by scraping the poster url and follower stats, and completed the tags filter, zoom and pan function. I certainly learnt a lot about react and d3 during the process.'
    },
    {
      'name': 'Yuanyang Ren',
      'mail': 'yren@kth.se',
      'distribution': 'UX , Visual Style design and D3.js',
      'anime': 'Pokemon',
      'intro': 'Having a background in interaction and web design, explored the visual structure and conducted the design process of the Animeet web (from ideation to prototype).  Contribute visual scheme design and visualization graphs design and their interaction and operation module design. Made lo-fi and hi-fi prototypes and UX instructions for supporting the development phase. Co-operated with the team for web development using react. Mainly, developed the force-directed graph by D3.js.'
    },
    {
      'name': 'Xinmiao Yu',
      'mail': 'xinmiao@kth.se',
      'distribution': 'React and D3.js',
      'anime': 'Fairy Tail',
      'intro': 'Having some experience about web development using React. Created the initial version of the scatterplot by D3.js. Implemented the Range selection component and built line charts by D3.js. Implemented the search box component with auto-complete function. Developed the pages About, Team and Demo. '
    },
  ]
  return (
    <div className="info rounded bg-gradient-to-b from-teaminfo-start to-teaminfo-end mx-10 font-ssp text-white relative" style={{ height: '15vw' }}>
      <div className="info-tag absolute">
        <img alt='' src={NameTitle} style={{ height: '3vw' }} />
        <span className="info-tag-name absolute" style={{ fontSize: '1.6vw' }}>{memberInfos[props.displayOne].name}</span>  
      </div>
      <div className="info-text">
        <div className="flex flex-row mb-4"  style={{ fontSize: '1.4vw' }}>       
          <span className="w-1/2"> Work Distribution: {memberInfos[props.displayOne].distribution}</span>
          <span className="w-1/2"> Favorite Anime: {memberInfos[props.displayOne].anime}</span>
        </div>
        <div style={{ fontSize: '1.2vw' }}> {memberInfos[props.displayOne].intro}</div>
        <span className="info-tag-mail absolute" style={{ fontSize: '1.2vw' }}>{memberInfos[props.displayOne].mail}</span>  
      </div>
    </div>
  )
}