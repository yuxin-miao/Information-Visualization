import React from "react";
import './about.css';

export const About = (props) => {
  return (
    <div className={`${props.className ? props.className : ''} col-span-full font-ssp flex flex-col justify-around px-8` }>

      <div className="container1 flex dotted relative mt-5">
        <div className="title1 absolute" style={{ fontSize: '4vw'}}>About</div>
        <div className="circle1 absolute bg-gradient-to-b from-circle1-top to-circle1-bottom"></div>
        <div className="content bg-gradient-to-b from-blue-start to-blue-end text-white w-full h-full" style={{ fontSize: '1.3vw' }}>
        Anime has long been at the heart of Japanese culture, being popular among a wide range of generations worldwide. There are thousands of animes in the world, with a high diversity of types and contents. This makes it hard for people with different preference to find the one they like. Animeet is an interactive platform aiming to help anime watchers to find their heart’s animes from thousands of choices. Anime watchers can explore animes by searching and selecting their preferred types, studios, voice actors and other filters. They can also find similar or related animes based on what they watched and like. We hope that Animeet can help you find out an anime that satisfy all your single needs and give you the best watching experience. Let’s explore on Animeet and enjoy some animes now!        </div>
      </div>

      <div className="container2 flex dotted relative">
        <div className="title2 absolute" style={{ fontSize: '4vw' }}>Data</div>
        <div className="circle2 absolute bg-gradient-to-b from-circle2-top to-circle2-bottom"></div>
        <div className="content bg-gradient-to-b from-blue-start to-blue-end text-white w-full h-full" style={{ fontSize: '1.3vw' }}>
        The data is from Kaggle dataset: https://www.kaggle.com/vishalmane10/anime-dataset-2022, that scrapes anime data from the anime planet website: https://www.anime-planet.com. It contains 18494 anime. We scraped the anime poster and followers’ data from the website by ourselves and did data cleansing to come up with the final dataset. The data won’t be profitable and is only used for learning purpose.
        </div>
      </div>

      <div className="container3 flex dotted relative">
        <div className="title3 absolute" style={{ fontSize: '4vw' }}>Methods</div>
        <div className="circle3 absolute bg-gradient-to-b from-circle3-top to-circle3-bottom"></div>
        <div className="content bg-gradient-to-b from-blue-start to-blue-end text-white w-full h-full" style={{ fontSize: '1.3vw' }} >
          Animeet is built using React. The preprocessed dataset is loaded through papaparse, then extracted and modified based on different usage. We have imported several libraries to support components development and dataflow, such as react-redux and react-router-dom. For a rapid build of customized user interface, we select tailwindcss as the CSS framework.     
          All the plots are built through D3.js. 
        </div>
      </div>
    </div>
  )
}