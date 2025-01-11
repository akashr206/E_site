import React from 'react'

const InputDisable = (props) => {
    return (
        <div>
            <input
                type={props.email}
                value={props.value}
                placeholder={props.placeholder}
                disabled
                className="p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 w-full cursor-not-allowed"
            />

        </div>
    )
}

export default InputDisable
