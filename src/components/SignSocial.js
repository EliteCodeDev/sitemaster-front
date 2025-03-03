import { signIn } from "next-auth/react";
import Cbutton from "./interfaz/Cbutton";
import { GoogleIcon, GithubIcon } from "./interfaz/Icons";


export default function Example() {
    return (
        <>
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm font-medium leading-6">
                        <span className="bg-white px-6 text-gray-900">o</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <Cbutton
                        classType="auth"
                        onClick={() => signIn('google')} startContent={<GoogleIcon></GoogleIcon>} >
                        <span className="text-sm font-semibold leading-6">Google</span>

                    </Cbutton>

                    <Cbutton
                        onClick={() => signIn('github')}
                        classType="auth"
                        startContent={<GithubIcon></GithubIcon>}
                    >
                        <span className="text-sm font-semibold leading-6">GitHub</span>
                    </Cbutton>

                </div>
            </div>
        </>
    )
}
