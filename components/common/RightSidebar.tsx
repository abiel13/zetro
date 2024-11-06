import React from 'react'

const RightSidebar = () => {
  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className="flex flex-1 flex-col justify-start ">
        <h1 className='text-heading4-medium text-[#333]'>Suggested Communities</h1>
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h1 className='text-heading4-medium text-[#333]'>Suggested Users</h1>
      </div>
    </section>
  )
}

export default RightSidebar
