import { Outlet } from 'react-router-dom'
import BottomTabNav from './BottomTabNav'
import PageContainer from './PageContainer'
import SideNav from './SideNav'

export default function AppShell() {
  return (
    <div className="min-h-dvh md:flex">
      <SideNav />
      <div className="flex-1 pb-20 md:pb-0">
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
      <BottomTabNav />
    </div>
  )
}
