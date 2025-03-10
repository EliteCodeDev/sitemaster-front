import Layout from '../components/layout/dashboard';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ListWebsites from './websites/websiteList';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Index() {
  const router = useRouter();


  return (
    <Layout title="Tus websites">


      <div className="flex flex-col space-y-10">
          <div>
            <ListWebsites />
          </div>
      </div>


    </Layout>
  );
};