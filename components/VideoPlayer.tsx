// components/VideoPlayer.js
import React from 'react'

export default function VideoPlayer({ url }: { url: string }) {
  const urlEmbed = url
  const params = new URLSearchParams(new URL(urlEmbed).search)
  const videoId = params.get('v')
  return (
    <div className="player-wrapper">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          width: '100%',
          height: '30rem',
          border: 'none',
        }}
      />
    </div>
  )
}
