import React from 'react'
import FetchVps from './vpsCard'
import Layout from '@/components/layout/dashboard'
export default function Index() {
  return (
    <Layout title="Tus VPS">
      <FetchVps />
    </Layout>
  )
}
