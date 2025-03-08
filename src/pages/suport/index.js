import Layout from '@/components/layout/dashboard'
import React from 'react'
import Supports from './suports'

export default function Index() {
  return (
    <Layout>
      <div className="flex flex-col space-y-10">
        <Supports></Supports>

      </div>
    </Layout>
  )
}
