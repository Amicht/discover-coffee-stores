import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const CoffeeStore = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <div>
      CoffeeStore id: {id}
      <Link href="/">Back to home</Link>
      
    </div>
  )
}

export default CoffeeStore