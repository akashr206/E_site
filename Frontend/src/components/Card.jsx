import React from 'react'

const Card = (props) => {
  return (
    <div className='border m-1 flex-col flex w-[200px] gap-1 p-1 justify-center items-center'>
        <p>userId : {props.userId}</p>
        <p>title : {props.title}</p>
    </div>
  )
}

export default Card
