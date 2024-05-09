import type React from "react";

type Input = {
    state: boolean,
    items: Array<DropdownItem>
}

export type DropdownItems = {
    state?: boolean,
    setState?: React.Dispatch<React.SetStateAction<boolean>>,
    handleDropdown?: () => void,
    items: Array<DropdownItem>
}

export type DropdownItem = {
    label: string,
    dest: string,
    requiredLevel?: Array<string>
}

function Dropdown(props: Input) {

    return (
        <>
            <ul className="dropdown-list">
                {
                    props.items.map((item, index) => {
                        return (
                        <li key={index}>
                            <a href={item.dest} className='dropdown-link'>
                                {item.label}
                            </a>
                        </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

export default Dropdown;