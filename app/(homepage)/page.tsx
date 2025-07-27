import HomepageFeatureContainer from '@/containers/homepage/feature.container'
import HomepageMainContainer from '@/containers/homepage/main.container'
import HomepageRoomContainer from '@/containers/homepage/room.container'

export default function Home() {
  return (
    <div>
      <HomepageMainContainer />
      <HomepageFeatureContainer />
      <HomepageRoomContainer />
    </div>
  )
}
