import React from 'react'

const ChatDesign = () => {
   const message = {
      send:"Hello Hi",
      recieve : "Hi How are u?"
   }
  return (
    <div>

      <div>
         <span>{message.send}</span>
      </div>
      <div>
         <span>{}</span>
      </div>
    </div>
  )
}
export default ChatDesign