'use client'

import { Tab, Tabs } from "@nextui-org/react";
import LoginForm from "./login";
import SignupForm from "./signup";


function UserAuthLayout() {

    return (
        <div className="w-full flex flex-col items-center mt-[14%]">

            <Tabs className="max-w-[30rem]" aria-label="auth-option" size="lg" color="primary" fullWidth>
                <Tab key="login" title="Login">
                    <LoginForm />
                </Tab>
                <Tab key="signup" title="Sign Up">
                    <SignupForm />
                </Tab>
            </Tabs>

        </div>
    )

}

export default UserAuthLayout;