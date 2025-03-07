import Layout from '@/components/layout/dashboard'
import React from 'react'
import Suports from './suports'

export default function Index() {
  return (
    <Layout>
      <div className="flex flex-col space-y-10">
        <h1>Soporte</h1>
        <Suports></Suports>
      </div>
    </Layout>
  )
}
