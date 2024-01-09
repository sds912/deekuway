import React from 'react'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import { useMediaQuery } from 'react-responsive'

export default function AgenciesPage() {

	const isTabletOrMobile =  useMediaQuery({ query: '(max-width: 1224px)' })

  return (
    <>
    <div>
      
    </div>
    {isTabletOrMobile && <BottomNav />}

    </>
  )
}
