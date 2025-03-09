import Layout from '@/components/layout/dashboard'
import React from 'react'
import Supports from './supports'

export default function Index() {
  return (
    <Layout>
      <div className="flex flex-col space-y-10">
        <Supports></Supports>

      </div>
    </Layout>
  )
}
