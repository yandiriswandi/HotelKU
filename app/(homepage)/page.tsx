import HomepageMainContainer from '@/containers/homepage/main.container'
import HomepageFeatureContainer from '@/containers/homepage/feature.container'
import HomepageJobContainer from '@/containers/homepage/room.container'

export default function Home() {
  return (
    <div>
      <HomepageMainContainer />
      <HomepageFeatureContainer />
      <HomepageJobContainer />
    </div>
  )
}
