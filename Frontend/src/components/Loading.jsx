import React from 'react'

const Loading = () => {
    return (
        <div className='w-[100vw] z-0 flex h-[100vh] bg-opacity-50 absolute top-0 bg-gray-50  items-center justify-center'>
            <span className="text-indigo-600 loading loading-dots loading-lg"></span>
        </div>
    )
}
export default Loading
