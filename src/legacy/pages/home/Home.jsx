import React, { useEffect } from 'react'
import Banner from "../../components/home_sections_inside/banner/Banner"
import MoviesRow from "../../components/home_sections_inside/movies-row/MoviesRow"
import TutorialsRow from "../../components/home_sections_inside/tutorials-row/TutorialsRow"
import TopChannelsRow from "../../components/home_sections_inside/top-channels-row/TopChannelsRow"
import { setSeoTags } from '../../utils/seo'

export default function Home() {
  useEffect(() => {
    setSeoTags({
      title: "ZiyoFlix — Kinolar, Seriallar, Darsliklar, Kanallar, Classroom",
      description: "ZiyoFlix — kinolar va seriallar tomosha qiling, onlayn kurslar orqali bilim oling. Kanallar va Classroom bilan hammasi bir joyda.",
      image: '/Ziyo-Flix-Logo.png',
      type: 'website'
    })
  }, [])
  return (
    <div className="home">
      <Banner />
      <div className="home__content">
        <MoviesRow />
        <TutorialsRow />
        <TopChannelsRow />
      </div>
    </div>
  )
}

