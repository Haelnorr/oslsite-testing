import type React from "react";

type Input = {
    items: Array<DropdownItem>,
}

export type DropdownItems = {
    state: boolean,
    setState: React.Dispatch<React.SetStateAction<boolean>>,
    handleDropdown: () => void,
    items: Array<DropdownItem>
}

export type DropdownItem = {
    label: string,
    dest: string,
    show: boolean
}

function Dropdown(props: Input) {
    return (
        <>
            <ul className="dropdown-list">
                {
                    props.items.map((item, index) => {
                        if (item.show) {
                            return (
                            <li key={index}>
                                <a href={item.dest} className='dropdown-link'>
                                    {item.label}
                                </a>
                            </li>
                            )
                        }
                    })
                }
            </ul>
        </>
    )
}

export default Dropdown;