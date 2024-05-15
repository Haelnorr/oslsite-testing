import {useState} from 'react';
import OSLLogoImage from "../assets/logo.png";
import ProfileIcon from "../assets/icons8-male-user-96.png";
import type { DropdownItems } from './Dropdown';
import Dropdown from './Dropdown';
import './Navbar.css';

type Input = {
    userLoggedIn: boolean;
    userPerms: Array<string>
}

type NavItem = {
    label: string,
    dest: string,
    dropdown?: DropdownItems
}

function userCanAccess(requiredLevel: Array<string>, userPerms: Array<string>): boolean {
    if (requiredLevel.some(perm => userPerms.includes(perm))) {
        return true;
    }
    return false;
}

function Navbar(props: Input) {
    const userPerms = props.userPerms;
    const [leagueDropdownState, SetLeagueDropdownState] = useState(false);
    const leagueDropdown: DropdownItems = {
        state:leagueDropdownState,
        setState:SetLeagueDropdownState,
        handleDropdown:()=>leagueDropdown.setState(!leagueDropdown.state),
        items: [
            {
                label: 'Register',
                dest: '/league/register',
                show: true
            },
            {
                label: 'Seasons',
                dest: '/league',
                show: true
            },
            {
                label: 'Teams',
                dest: '/league/teams',
                show: true
            },
            {
                label: 'Players',
                dest: '/league/players',
                show: true
            }/**, to be implemented in a future version
            {
                label: 'Stats',
                dest: 'league/stats',
                show: true
            } */
        ]
    }

    const [profileDropdownState, setProfileDropdownState] = useState(false);
    const profileDropdown: DropdownItems = {
        state:profileDropdownState,
        setState:setProfileDropdownState,
        handleDropdown:()=>profileDropdown.setState(!profileDropdown.state),
        items: [
            {
                label: 'Profile',
                dest: '/profile',
                show: true
            },
            {
                label: 'My Team',
                dest: '/manage/teams',
                show: true
            },
            {
                label: 'Management Tools',
                dest: '/manage',
                show: userCanAccess(['admin', 'leag_coord', 'leag_comm'], userPerms)
            },
            {
                label: 'Logout',
                dest: '/auth/logout',
                show: true
            }
        ]
    }

    const navItems: NavItem[] = [
        {
            label: "Home",
            dest: "/",
        },
        {
            label: "League",
            dest: "/league",
            dropdown: leagueDropdown
        },
        {
            label: "Discord",
            dest: "https://slapshot.gg/OSL",
        },
        {
            label: "The Pond",
            dest: "/the-pond",
        }
    ]

    const [click, setClick] = useState(false);
    const handleClick = () => {setClick(!click);console.log('test')}
    const closeMobileMenu = () => setClick(false);

    return (
        <>
            <nav className="navbar">
                <a href="/">
                    <img className="h-10 text-white font-bold text-base mt-1"
                        src={OSLLogoImage.src} 
                        alt="OSL"
                        loading="lazy" />
                </a>
                <div className="menu-icon hover:cursor-pointer"
                    onClick={handleClick}>
                    {click &&
                        <svg className="w-[32px] h-[32px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"/>
                        </svg>
                        ||
                        <svg className="w-[32px] h-[32px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
                        </svg>
                    }
                </div>
                <ul className={`${click ? 'nav-menu active' : 'nav-menu'} align-middle`}>
                    {
                        navItems.map((item, index) => (
                            <li className="nav-item mt-1" key={index+1}>
                                {item.dropdown && 
                                    <span>
                                        <a onClick={item.dropdown.handleDropdown} className="hover:cursor-pointer">
                                            {item.label}
                                            {item.dropdown.state &&
                                                <svg className="w-[16px] h-[16px] text-gray-800 dark:text-white ml-1 mb-1 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
                                                </svg>
                                                ||
                                                <svg className="w-[16px] h-[16px] text-gray-800 dark:text-white ml-1 mb-1 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7"/>
                                                </svg>
                                            }
                                        </a>
                                        {item.dropdown.state &&
                                            <Dropdown items={item.dropdown.items}/>
                                        }
                                    </span>
                                    ||
                                    <a href={item.dest} onClick={closeMobileMenu}>
                                        {item.label}
                                    </a>
                                }
                            </li>
                        ))
                    }
                    {props.userLoggedIn &&
                        <li className="nav-item ml-[-10px]" key={navItems.length+1}>
                            <a onClick={profileDropdown.handleDropdown} className="hover:cursor-pointer">
                                <img className="h-8 text-white font-bold text-base profile-icon"
                                src={ProfileIcon.src} 
                                alt="OSL"
                                loading="lazy" />
                                <span className="profile-link-mobile">Profile</span>
                            </a>
                            {profileDropdown.state &&
                                <Dropdown items={profileDropdown.items}/>
                            }
                        </li>
                        ||
                        <li className='nav-item mt-1 mb-1'>
                            <a href="/auth/login">Login</a>
                        </li>
                    }
                </ul>
            </nav>
        </>
    )
}

export default Navbar;