"use client";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const QuillNoSSR = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["blockquote", "code-block"],
    [{ script: "sub" }, { script: "super" }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "script",
  "blockquote",
  "code-block",
];

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  return (
    <QuillNoSSR
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      modules={modules}
      formats={formats}
    />
  );
}
