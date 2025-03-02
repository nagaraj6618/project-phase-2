
// import React from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeRaw from "rehype-raw";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { Copy } from "lucide-react";

// const ReadmeViewer = ({ content }) => {
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//   };

//   return (
   
//    //  <div className="p-4 w-full bg-gray-900 text-white rounded-xl shadow-lg text-left">
//    <div className="p-4 w-full bg-gray-900 text-white rounded-xl shadow-lg text-left max-w-full overflow-hidden">

//    <ReactMarkdown
//         children={content}
//         remarkPlugins={[remarkGfm]}
//         rehypePlugins={[rehypeRaw]}
//         components={{
//           code({ node, inline, className, children, ...props }) {
//             const match = /language-(\w+)/.exec(className || "");
//             const codeString = String(children).replace(/\n$/, "");
//             return !inline && match ? (
//               <div className="relative w-full">
//                 <button
//                   onClick={() => copyToClipboard(codeString)}
//                   className="absolute top-2 right-2 bg-gray-700 p-1 rounded text-white hover:bg-gray-600"
//                 >
//                   <Copy size={16} />
//                 </button>
//                 <SyntaxHighlighter
//                   style={oneDark}
//                   language={match[1]}
//                   PreTag="div"
//                   className="w-full"
//                   {...props}
//                 >
//                   {codeString}
//                 </SyntaxHighlighter>
//               </div>
//             ) : (
//               <code className="bg-gray-800 p-1 rounded text-sm" {...props}>{children}</code>
//             );
//           },
//           h1: ({ children }) => <h1 className="text-2xl font-bold my-4">{children}</h1>,
//           h2: ({ children }) => <h2 className="text-xl font-semibold my-3">{children}</h2>,
//           h3: ({ children }) => <h3 className="text-lg font-medium my-2">{children}</h3>,
//           p: ({ children }) => <p className="text-base my-2">{children}</p>,
//           li: ({ children }) => <li className="ml-4 list-disc">{children}</li>,
//           pre: ({ children }) => <pre className="bg-gray-800 p-3 rounded my-2 overflow-auto w-full">{children}</pre>
//         }}
//       />
//     </div>
//   );
// };

// export default ReadmeViewer;


// import React from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeRaw from "rehype-raw";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { Copy } from "lucide-react";

// const ReadmeViewer = ({ content }) => {
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//   };

//   return (
//     <div className=" w-full max-w-xl mx-auto text-white rounded-xl shadow-lg text-left overflow-hidden md:max-w-lg sm:max-w-sm">
//       <ReactMarkdown
//         children={content}
//         remarkPlugins={[remarkGfm]}
//         rehypePlugins={[rehypeRaw]}
//         components={{
//           code({ node, inline, className, children, ...props }) {
//             const match = /language-(\w+)/.exec(className || "");
//             const codeString = String(children).replace(/\n$/, "");
//             return !inline && match ? (
//               <div className="relative w-full overflow-x-auto">
//                 <button
//                   onClick={() => copyToClipboard(codeString)}
//                   className="absolute top-2 right-2 bg-gray-700 p-1 rounded text-white hover:bg-gray-600"
//                 >
//                   <Copy size={16} />
//                 </button>
//                 <SyntaxHighlighter
//                   style={oneDark}
//                   language={match[1]}
//                   PreTag="div"
//                   className="w-full text-sm md:text-base"
//                   {...props}
//                 >
//                   {codeString}
//                 </SyntaxHighlighter>
//               </div>
//             ) : (
//               <code className="bg-gray-800 p-1 rounded text-xs md:text-sm" {...props}>{children}</code>
//             );
//           },
//           h1: ({ children }) => <h1 className="text-xl md:text-xl font-bold my-4">{children}</h1>,
//           h2: ({ children }) => <h2 className="text-xl md:text-xl font-semibold my-3">{children}</h2>,
//           h3: ({ children }) => <h3 className="text-lg md:text-xl font-medium my-2">{children}</h3>,
//           p: ({ children }) => <p className="text-base md:text-lg my-2">{children}</p>,
//           li: ({ children }) => <li className="ml-4 list-disc text-sm md:text-base">{children}</li>,
//           pre: ({ children }) => <pre className="bg-gray-800 p-3 rounded my-2 overflow-auto w-full text-xs md:text-sm">{children}</pre>
//         }}
//       />
//     </div>
//   );
// };

// export default ReadmeViewer;


import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy } from "lucide-react";

const ReadmeViewer = ({ content }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="text-white text-left overflow-hidden px-2 sm:px-3  sm:max-w-xl md:max-w-xl">
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            return !inline && match ? (
              <div className="relative  overflow-x-auto">
                <button
                  onClick={() => copyToClipboard(codeString)}
                  className="absolute top-2 right-2 bg-gray-700 p-1 rounded text-white hover:bg-gray-600"
                >
                  <Copy size={16} />
                </button>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  className="w-full text-xs"
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-gray-800 p-1 rounded text-xs" {...props}>{children}</code>
            );
          },
          h1: ({ children }) => <h1 className="text-lg font-bold my-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold my-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-medium my-1">{children}</h3>,
          p: ({ children }) => <p className="text-sm my-1">{children}</p>,
          li: ({ children }) => <li className="ml-2 list-disc text-sm">{children}</li>,
          pre: ({ children }) => <pre className="bg-gray-800 p-2 rounded my-1 overflow-auto w-full text-xs">{children}</pre>
        }}
      />
    </div>
  );
};

export default ReadmeViewer;
