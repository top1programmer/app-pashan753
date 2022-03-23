import React from "react";
import MDEditor from '@uiw/react-md-editor';
import Yamde from 'yamde'
import { useSelector } from 'react-redux';

export const MarkdownEditor = (props) => {
    const theme = useSelector((state) => state.theme)
  return (
    <Yamde
      placeholder={props.placeholder}
      value={props.textValue}
      handler={props.setTextValue}
      theme={theme} />
  )
}
// export const MarkdownEditor = (props) => {
//   const [value, setValue] = React.useState("**Hello world!!!**");
//   return (
//     <div dataColorMode="light">
//   <div className="wmde-markdown-var"> </div>
//       <MDEditor
//       toolbars={[
//       'dark'
//       ]}
//         textareaProps={{
//           placeholder: 'enter text'
//         }}
//         value={props.textValue}
//         onChange={props.setTextValue}
//       />
//       </div>
//   );
// }
