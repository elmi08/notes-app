import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"

const PasswordInput = ({ value, onChange, placeholder }) => {

    const [isShowPassword, setisShowPasssword] = useState(false)

    const toggleShowPassword = () => {
        setisShowPasssword(!isShowPassword)
    }

    return (
        <div className='flex items center w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'>
            <input
                value={value}
                onChange={onChange}
                type={isShowPassword ? "text" : "password"}
                placeholder={placeholder || "Password"}
                className='w-full text-sm bg-transparent py-0.7 mr-2 rounded outline-none '
            />
            {isShowPassword ? <FaRegEye
                size={22}
                className="text-primary cursor-pointer"
                onClick={() => toggleShowPassword()}

            /> : <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={() => toggleShowPassword()}
            />}
        </div>
    )
}

export default PasswordInput
