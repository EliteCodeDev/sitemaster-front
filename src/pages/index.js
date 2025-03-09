import Layout from '../components/layout/dashboard';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Featured from './dashboard/Featured';
import ListInstances from './dashboard/subsList';
import ListWebsites from './dashboard/websiteList';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Index() {
  const router = useRouter();


  return (
    <Layout title="Tus websites">


      <div className="flex flex-col space-y-10">

          {/*
          <div>
            <ListInstances />
          </div>
          */}
          <div>
            <ListWebsites />
          </div>
          {/*
          <Featured />
          */}
      </div>


    </Layout>
  );
};