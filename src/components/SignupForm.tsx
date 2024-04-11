import React, { useState } from "react";
import Callout from "./Callout";
import { srlm_post } from "../util/srlmUtils";

interface User {
    username: string;
    email: string;
    password: string;
    passwordRepeat: string;
}

interface CalloutInterface {
    type: string;
    has: boolean;
    header: string;
    message: string;
}

const SignupForm = () => {
    const [user, setUser] = useState<User>({
        username: "",
        email: "",
        password: "",
        passwordRepeat: "",
    });

    const [callout, setCallout] = useState<CalloutInterface>({
        type: '',
        has: false,
        header: '',
        message: ''
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (user.password !== user.passwordRepeat) {
            setCallout({
                type: 'error',
                has: true,
                header: "Signup Failed",
                message: "Password and Repeat Password do not match."
            })
        }

        if (user.password.length < 6) {
            setCallout({
                type: 'error',
                has: true,
                header: "Signup Failed",
                message: "Password needs to be a minimum of 6 characters long."
            })
        }

        if (!user.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {            
            setCallout({
                type: 'error',
                has: true,
                header: "Signup Failed",
                message: "Valid Email not entered."
            })
        }

        if (user.username.length < 4) {
            setCallout({
                type: 'error',
                has: true,
                header: "Signup Failed",
                message: "Username needs to be a minimum of 4 characters long."
            })
        }

        if (!callout.has && callout.type !== 'error') {
            const newUser = {
                email: user.email,
                password: user.password,
                username: user.username,
            }
            
            srlm_post('/users', '', newUser)

        }
    };

    return (
        <form className="flex gap-5 flex-col w-2/3 lg:w-1/3" onSubmit={handleSubmit}>
            <Callout has={callout.has} header={callout.header} message={callout.message} type={callout.type} />

            <label className="text-white font-bold flex flex-col gap-2">
                Username: <input className="text-black font-normal p-1" type="text" name="username" value={user.username} onChange={handleChange} required />
            </label>
            <label className="text-white font-bold flex flex-col gap-2">
                Email: <input className="text-black font-normal p-1" type="email" name="email" value={user.email} onChange={handleChange} required />
            </label>
            <label className="text-white font-bold flex flex-col gap-2">
                Password: <input className="text-black font-normal p-1" type="password" name="password" value={user.password} onChange={handleChange} required minLength={6} />
            </label>
            <label className="text-white font-bold flex flex-col gap-2">
                Repeat Password: <input className="text-black font-normal p-1 " type="password" name="passwordRepeat" value={user.passwordRepeat} onChange={handleChange} required minLength={6} />
            </label>
            <div className="py-2">
                <button
                    type="submit"
                    className="bg-blue-400 bg-opacity-80 hover:shadow-md hover:bg-opacity-60 duration-200 transition-all float-end text-white font-bold py-2 rounded-md shadow-black w-full"
                >
                    Create Account
                </button>
            </div>
        </form>
    );
};

export default SignupForm;
