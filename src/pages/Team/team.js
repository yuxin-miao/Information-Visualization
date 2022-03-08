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
  const [displayOne, setDisplayOne] = useState(0)
  const photos = [Harits, Jenny, Qinbai, Ryan, Xinmiao]

  return (
    <div className={`${props.className ? props.className : ''} col-span-full font-ssp` }>
      <div className="team w-full h-full flex flex-col space-around"> 
        <div className="justify-self-center self-center h-min mt-24 mb-20">
          <img alt='' src={TeamLogo} style={{ height: '7vw' }} />
        </div>
        <div className="team-member flex flex-row justify-center">
          {photos.map((item, index) => {
            return (
              <div className={index === displayOne ? 'opacity-1' : 'opacity-60'} key={index} onClick={() => setDisplayOne(index)}>         
                <img alt='' src={item} style={{ height: '16vw' }} />
              </div>
            )
          })}
        </div>
        <div className="member-info flex-grow-1">
          <Info displayOne={displayOne}/>
        </div>
      </div>
    </div>
  )
}

const Info = (props) => {
  const memberInfos = [
    {
      'name': 'Harits Nur Fauzan',
      'mail': 'xxxxxxx@kth.se',
      'distribution': 'React — D3.JS — CI/CD',
      'anime': 'One Piece',
      'intro': 'first intro Sreach for the anime, studio or Vioce actor。Sreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce'
    },
    {
      'name': 'Kwan Mei Wong',
      'mail': 'xxxxxxx@kth.se',
      'distribution': 'React — D3.JS — CI/CD',
      'anime': 'Demon Slayer',
      'intro': 'second intro Sreach for the anime, studio or Vioce actor。Sreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce'
    },
    {
      'name': 'Qinbai',
      'mail': 'xxxxxxx@kth.se',
      'distribution': 'React — D3.JS — CI/CD',
      'anime': 'Ranking of Kings',
      'intro': 'third intro Sreach for the anime, studio or Vioce actor。Sreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce'
    },
    {
      'name': 'Yuanyang Ren',
      'mail': 'xxxxxxx@kth.se',
      'distribution': 'React — D3.JS — CI/CD',
      'anime': 'Pokemon',
      'intro': 'fourth intro Sreach for the anime, studio or Vioce actor。Sreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce'
    },
    {
      'name': 'Xinmiao Yu',
      'mail': 'xxxxxxx@kth.se',
      'distribution': 'React — D3.JS — CI/CD',
      'anime': 'Fairy Tail',
      'intro': 'fifth intro Sreach for the anime, studio or Vioce actor。Sreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce actorSreach for the anime, studio or Vioce'
    },
  ]
  return (
    <div className="info rounded bg-gradient-to-b from-teaminfo-start to-teaminfo-end mx-10 font-ssp text-white relative" style={{ height: '15vw' }}>
      <div className="info-tag absolute">
        <img alt='' src={NameTitle} style={{ height: '3vw' }} />
        <span className="info-tag-name absolute" style={{ fontSize: '1.6vw' }}>{memberInfos[props.displayOne].name}</span>  
        <span className="info-tag-mail absolute" style={{ fontSize: '1.2vw' }}>{memberInfos[props.displayOne].mail}</span>  
      </div>
      <div className="info-text">
        <div className="flex flex-row mb-5"  style={{ fontSize: '1.4vw' }}>       
          <span className="w-1/2"> Work Distribution: {memberInfos[props.displayOne].distribution}</span>
          <span className="w-1/2"> Favorite Anime: {memberInfos[props.displayOne].anime}</span>
        </div>
        <div  style={{ fontSize: '1.2vw' }}> {memberInfos[props.displayOne].intro}</div>
      </div>
    </div>
  )
}