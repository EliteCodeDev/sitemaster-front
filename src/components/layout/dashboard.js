import React from 'react';
import Navbar from "../navbar";
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/20/solid';
import WhatsAppButton from "../../components/WhatsAppButton";
import Biblia from "../Bible"
import ToggleMode from "../ui/toggle-mode"


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
                                href="/upgrade/"
                                className="inline-flex items-center rounded-md bg-[var(--app-primary)] px-3 py-2 text-white shadow-sm hover:bg-[var(--app-primary-hovered)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-primary)]"
                            >
                                <PlusIcon className="h-5 w-auto" aria-hidden="true" />
                                <span className="ml-2 hidden sm:block text-sm font-medium">Crea una instancia</span>
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
