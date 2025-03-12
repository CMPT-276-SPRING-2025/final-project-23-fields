import { useEffect } from 'react'

export default function Typing({ paragraph, updateParagraph }) {
  useEffect(() => {
    console.log(paragraph)
  }, [paragraph]);

  return (
    <>
      <h1>This is a Typing Test</h1>
      <button onClick={()=>updateParagraph("Lorem Ipsum")}>Text</button>
    </>
  )
}