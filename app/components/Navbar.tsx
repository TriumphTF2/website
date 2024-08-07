import clsx from "clsx";
import React from 'react';
import { useLocation, useNavigate } from '@remix-run/react';
import { Theme, ThemeProvider, useTheme } from 'remix-themes';
import type { User } from "~/auth.server"
import { SerializeFrom } from "@remix-run/node";

export interface NavbarItemProps {
    href: string;
    label: string;
}

export interface NavbarProps {
    siteTitle?: string;
    items?: NavbarItemProps[];
    user: SerializeFrom<User> | null;
}

export const Navbar: React.FC<NavbarProps> = (props) => {
    // Component logic goes here
    const navigate = useNavigate();
    const currentpage = useLocation().pathname;
    const [menuOpen, setMenuOpen] = React.useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setProfileOpen(false);
    }

    const [profileOpen, setProfileOpen] = React.useState(false);
    const toggleProfile = () => {
        setProfileOpen(!profileOpen);
        setMenuOpen(false);
    }
    const [theme, setTheme] = useTheme();
    const toggleTheme = () => {
        switch (theme) {
            case Theme.LIGHT:
                setTheme(Theme.DARK);
                break;
            case Theme.DARK:
                setTheme(Theme.LIGHT);
                break;
            default:
                setTheme(Theme.LIGHT);
                break;
        }
    }

    const handleAuth = () => {
        if (props.user) {
            navigate('/dashboard');
            return;
        }
        navigate('/auth/steam');
        return
    }

    const logout = () => {
        navigate('/auth/logout');
        return;
    }

    return (
        // JSX markup for your component goes here
        <ThemeProvider specifiedTheme={theme} themeAction="/action/set-theme">
        <nav className={`${clsx(theme)} bg-primary-foreground dark:bg-secondary-foreground border dark:border-secondary-foreground shadow sticky top-0 z-50`}>
            <div className='container flex flex-wrap justify-between items-center mx-auto'>
                <a href="/" className='flex items-center flex-grow'>
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-primary dark:text-secondary">
                        {props.siteTitle || 'TriumphTF2'}
                    </span>
                </a>

                <div className='flex items-center'>
                    <button onClick={toggleMenu} id="menu-toggle" type="button" className='inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden'>
                        <span className="sr-only">Open main menu</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                    <button onClick={toggleProfile} id="profile-button" type="button" className='inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden'>
                        <span className='sr-only'>Profile Menu</span>
                        <svg className='h-6 w-6' fill='none' viewBox='0 0 32 32' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z' />
                        </svg>
                    </button>
                    <button onClick={toggleTheme} id="theme-toggle" type="button" className='inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden'>
                        <span className='sr-only'>Toggle Theme</span>
                        <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 16 16' stroke='none'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708' />
                        </svg>
                    </button>
                </div>

                <div className={menuOpen ? "w-full md:block md:w-auto md:space-x-8-force" : "w-full md:block md:w-auto md:space-x-8-force hidden"} id="mobile-menu">
                    <ul className='flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium'>
                        {props.items?.map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className={currentpage === item.href ? 'block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white' : 'block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={profileOpen ? "w-full md:block md:w-auto md:space-x-8" : "w-full md:block md:w-auto md:space-x-8 hidden"} id="profile-menu">
                    <ul className='flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium'>
                        <li>
                            <button onClick={handleAuth} type="button" className='sm:w-full sm:text-left block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'>
                                {props.user ? props.user.nickname : 'Login'}
                            </button>
                        </li>
                        { props.user && (
                        <li>
                            <button onClick={logout} type="button" className='sm:w-full sm:text-left block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'>
                                Logout
                            </button>
                        </li>
                    )}
                    </ul>
                </div>

                <div className='w-full md:block md:w-auto md:space-x-8-force hidden' id="theme-menu">
                    <ul className='flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium'>
                        <li>
                            <button onClick={toggleTheme} id="theme-toggle" type="button" className='inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'>
                                <span className='sr-only'>Toggle Theme</span>
                                <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 16 16' stroke='none'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708' />
                                </svg>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        </ThemeProvider>
    );
};


