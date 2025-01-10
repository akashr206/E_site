import React from 'react';
import Logo from '../assets/logo.jpg';

const IconButton = ({ icon, label, link }) => {
    return (
        <a
            href={`http://localhost:5000/auth/${link}`} // Redirect directly to the OAuth endpoint
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition-shadow shadow-sm"
        >
            <img src={icon} alt={`${label} logo`} className="w-5 h-5" />
            <span className="text-gray-700 font-medium">{label}</span>
        </a>
    );
};

const Login = () => {
    return (
        <div className='py-10 '>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img alt="MR Fashions" src={Logo} className="mx-auto h-16 rounded-full w-auto" />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="#" method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <div className='flex items-center gap-1 p-5 justify-center'>
                        <div className='border w-[100px] h-0'></div>
                        <div><p className='from-neutral-800'>or continue with</p></div>
                        <div className='border w-[100px] h-0'></div>
                    </div>
                    <div className="flex justify-center items-center gap-4">
                        <IconButton
                            icon="http://pluspng.com/img-png/google-logo-png-open-2000.png"
                            label="Google"
                            link="google"
                        />
                        <IconButton
                            icon="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                            label="GitHub"
                            link="github"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
