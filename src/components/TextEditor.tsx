import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const RichTextExample: React.FC<Props> = ({ value, onChange }) => {
  const contentBlock = htmlToDraft(value || "");
  const contentState = ContentState.createFromBlockArray(
    contentBlock.contentBlocks
  );
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState)
  );

  useEffect(() => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    onChange(html);
  }, [editorState]);

  return (
    <div className={"hover:cursor-text text-black"}>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName p-2 bg-white text-black min-h-[100px] rounded"
      />
    </div>
  );
};

export default RichTextExample;
