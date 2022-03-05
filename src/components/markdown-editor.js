import React from "react";
import MDEditor from '@uiw/react-md-editor';

export const MarkdownEditor = (props) => {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className="container">
      <MDEditor
        value={props.textValue}
        onChange={props.setTextValue}
      />

    </div>
  );
}
