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
    isDropdown: boolean,
    dropdown?: DropdownItems
}

var leagueDropdown: DropdownItems = {
    items: [
        {
            label: 'Register',
            dest: '/league/register'
        },
        {
            label: 'Seasons',
            dest: '/league'
        },
        {
            label: 'Teams',
            dest: '/league/teams'
        },
        {
            label: 'Players',
            dest: '/league/players'
        }/**, to be implemented in a future version
        {
            id: 5,
            label: 'Stats',
            dest: 'league/stats'
        } */
    ]
}

var profileDropdown: DropdownItems = {
    items: [
        {
            label: 'Profile',
            dest: '/profile'
        },
        {
            label: 'My Team',
            dest: '/manage/teams'
        },
        {
            label: 'League Management',
            dest: '/manage/league',
            requiredLevel: ['admin', 'leag_coord', 'leag_comm']
        },
        {
            label: 'Admin Tools',
            dest: '/manage/admin',
            requiredLevel: ['admin', 'leag_comm']
        },
        {
            label: 'Logout',
            dest: '/logout'
        }
    ]
}

const navItems: NavItem[] = [
    {
        label: "Home",
        dest: "/",
        isDropdown: false
    },
    {
        label: "League",
        dest: "/league",
        isDropdown: true,
        dropdown: leagueDropdown
    },
    {
        label: "Discord",
        dest: "https://slapshot.gg/OSL",
        isDropdown: false
    },
    {
        label: "The Pond",
        dest: "/the-pond",
        isDropdown: false
    }
]

function Navbar(props: Input) {

    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    [leagueDropdown.state, leagueDropdown.setState] = useState(false);
    [profileDropdown.state, profileDropdown.setState] = useState(false);
    leagueDropdown.handleDropdown = () => leagueDropdown.setState(!leagueDropdown.state);
    profileDropdown.handleDropdown = () => profileDropdown.setState(!profileDropdown.state);
    const test = () => console.log('test');

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
                        navItems.map(item => (
                            <li className="nav-item mt-1">
                                {item.isDropdown && 
                                    <span>
                                        <a onClick={item.dropdown.handleDropdown} class="hover:cursor-pointer">
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
                        <li className="nav-item ml-[-5px]">
                            <a onClick={profileDropdown.handleDropdown} class="hover:cursor-pointer">
                                <img className="h-8 text-white font-bold text-base profile-icon"
                                src={ProfileIcon.src} 
                                alt="OSL"
                                loading="lazy" />
                                <span class="profile-link-mobile">Profile</span>
                            </a>
                            {profileDropdown.state &&
                                <Dropdown items={profileDropdown.items}/>
                            }
                        </li>
                        ||
                        <li class='nav-item'>
                            <a href="/login">Login</a>
                        </li>
                    }
                </ul>
            </nav>
        </>
    )
}

export default Navbar;