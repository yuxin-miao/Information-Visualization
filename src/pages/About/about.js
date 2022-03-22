import React from "react";
import './about.css';

export const About = (props) => {
  return (
    <div className={`${props.className ? props.className : ''} col-span-full font-ssp flex flex-col justify-around px-8` }>

      <div className="container1 flex dotted relative mt-5 transform1">
        <div className="title1 absolute" style={{ fontSize: '4vw'}}>About</div>
        <div className="circle1 absolute bg-gradient-to-b from-circle1-top to-circle1-bottom"></div>
        <div className="content bg-gradient-to-b from-blue-start to-blue-end text-white w-full h-full transform2" style={{ fontSize: '1.3vw' }}>
          <div>
        Are you exploring some new animes to watch? Finding one that you like from a huge pool of animes can be difficult. Animeet visualizes all the animes using scatterplot, provides various filters, and offers detailed information! Use Animeet to find out your heart's animes and get the best watching experience.  
        </div> 
        <div className="pt-3" style={{ fontSize: '1.1vw' }}>
        Related Project: B. Gobel, 'AniMap: An Interactive Visualization Supporting Serendipitous Discovery of Information about Anime', Dissertation, Malmö högskola/Kultur och samhälle, 2013. Available <a href={"http://muenva.github.io/animap/ "} style={{color:"#FFD93D",textDecoration:"underline"}}>online</a>. 
        </div>
        </div>
      </div>

      <div className="container2 flex dotted relative transform1">
        <div className="title2 absolute" style={{ fontSize: '4vw' }}>Data</div>
        <div className="circle2 absolute bg-gradient-to-b from-circle2-top to-circle2-bottom"></div>
        <div className="content bg-gradient-to-b from-blue-start to-blue-end text-white transform2" style={{ fontSize: '1.3vw' }}>
        The data is from <a href="https://www.kaggle.com/vishalmane10/anime-dataset-2022" style={{color:"#FFD93D",textDecoration:"underline"}} target="_blank" >
        Kaggle dataset
        </a>
        , that scrapes anime data from the <a href="https://www.anime-planet.com" style={{color:"#FFD93D",textDecoration:"underline"}} target="_blank">
         anime planet website
        </a>        
        . It contains 18494 anime. We scraped the anime poster and followers’ data from the website by ourselves and did data cleansing to come up with the final dataset. The data won’t be profitable and is only used for learning purpose. The data is last updated on 2022-01-16.
        </div>
      </div>

      <div className="container3 flex dotted relative transform1">
        <div className="title3 absolute" style={{ fontSize: '4vw' }}>Methods</div>
        <div className="circle3 absolute bg-gradient-to-b from-circle3-top to-circle3-bottom"></div>
        <div className="content bg-gradient-to-b from-blue-start to-blue-end text-white w-full h-full transform2" style={{ fontSize: '1.3vw' }} >
          Animeet is built using React. The preprocessed dataset is loaded through papaparse, then extracted and modified based on different usage. We have imported several libraries to support components development and dataflow, such as react-redux and react-router-dom. For a rapid build of customized user interface, we select tailwindcss as the CSS framework.     
          All the plots are built through D3.js. For furhter information, check our <a href={"https://github.com/yuxin-miao/Information-Visualization"} style={{color:"#FFD93D",textDecoration:"underline"}}>repo</a>. 
        </div>
      </div>
    </div>
  )
}