import React from 'react';
import Navbar from "../navbar";
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/20/solid';
import WhatsAppButton from "../../components/WhatsAppButton";
import Biblia from "../Bible"
import Cbutton from "@/components/interfaz/Cbutton";



export default function Layout({ children, title }) {
    return (
        <>
            <div className="min-h-full">

                {/* <ToggleMode /> */}
                <Navbar />

                {title && (
                    <header className="bg-white shadow-sm shadow-gray-300 dark:bg-gray-900">
                        <div className="mx-auto max-w-7xl py-5 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                            <h1 className="text-xl sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h1>
                            <Link
                                href='/upgrade/'>
                                <Cbutton
                                    // className=""
                                    classType={"primary"}
                                    className={""}
                                    startContent={
                                        <PlusIcon className="h-5" />
                                    }
                                >
                                    <span className="">Nueva Website</span>
                                </Cbutton>
                            </Link>
                        </div>
                    </header>
                )}


                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
                    <Biblia />
                </div>

                <main>
                    <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                    <WhatsAppButton />
                </main>

            </div>
        </>
    );
};
