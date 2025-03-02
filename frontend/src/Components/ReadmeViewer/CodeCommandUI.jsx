// import React, { useState } from "react";
// import { Copy } from "lucide-react";
// import { CopyToClipboard } from "react-copy-to-clipboard";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

// const CodeCommandUI = ({ code, command }) => {
//   const [copied, setCopied] = useState("");

//   const handleCopy = (type) => {
//     setCopied(`${type} copied!`);
//     setTimeout(() => setCopied(""), 2000);
//   };

//   return (
//     <div className="p-4 w-full max-w-3xl mx-auto border rounded-lg shadow-md bg-gray-900 text-white text-left sm:p-3 sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
//       <div className="mb-4">
//         <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
//           <h3 className="text-lg font-semibold">Code</h3>
//           <CopyToClipboard text={code} onCopy={() => handleCopy("Code")}>
//             <button className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-700 text-gray-300 rounded text-xs sm:text-sm">
//               <Copy className="mr-2" size={14} /> Copy
//             </button>
//           </CopyToClipboard>
//         </div>
//         <div className="border p-2 sm:p-3 rounded bg-gray-800 text-left text-xs sm:text-sm">
//           <SyntaxHighlighter language="javascript" style={dracula}>
//             {code}
//           </SyntaxHighlighter>
//         </div>
//       </div>

//       <div>
//         <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
//           <h3 className="text-lg font-semibold">Command</h3>
//           <CopyToClipboard text={command} onCopy={() => handleCopy("Command")}>
//             <button className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-700 text-gray-300 rounded text-xs sm:text-sm">
//               <Copy className="mr-2" size={14} /> Copy
//             </button>
//           </CopyToClipboard>
//         </div>
//         <div className="border p-2 sm:p-3 rounded bg-gray-800 text-left text-xs sm:text-sm">
//           <SyntaxHighlighter language="bash" style={dracula}>
//             {command}
//           </SyntaxHighlighter>
//         </div>
//       </div>
//       {copied && <div className="mt-2 text-green-400 text-sm sm:text-base">{copied}</div>}
//     </div>
//   );
// };

// export default CodeCommandUI;

import React, { useState } from "react";
import { Copy } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeCommandUI = ({ code, command }) => {
  const [copied, setCopied] = useState("");

  const handleCopy = (type) => {
    setCopied(`${type} copied!`);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="p-4 w-full max-w-3xl border rounded-lg shadow-md bg-gray-900 text-white text-left sm:p-3 sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
          <h3 className="text-lg font-semibold">Code</h3>
          <CopyToClipboard text={code} onCopy={() => handleCopy("Code")}>
            <button className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-700 text-gray-300 rounded text-xs sm:text-sm">
              <Copy className="mr-2" size={14} /> Copy
            </button>
          </CopyToClipboard>
        </div>
        <div className="border p-2 sm:p-3 rounded bg-gray-800 text-left text-xs sm:text-sm">
          <SyntaxHighlighter language="javascript" style={dracula}>
            {code}
          </SyntaxHighlighter>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
          <h3 className="text-lg font-semibold">Command</h3>
          <CopyToClipboard text={command} onCopy={() => handleCopy("Command")}>
            <button className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-700 text-gray-300 rounded text-xs sm:text-sm">
              <Copy className="mr-2" size={14} /> Copy
            </button>
          </CopyToClipboard>
        </div>
        <div className="border p-2 sm:p-3 rounded bg-gray-800 text-left text-xs sm:text-sm">
          <SyntaxHighlighter language="bash" style={dracula}>
            {command}
          </SyntaxHighlighter>
        </div>
      </div>
      {copied && <div className="mt-2 text-green-400 text-sm sm:text-base">{copied}</div>}
    </div>
  );
};

export default CodeCommandUI;

// Example usage
const exampleCode = `function greet() {
  console.log('Hello, world!');
}`;
const exampleCommand = `echo "Hello, world!"`;

export function TestComponent() {
  return (
    <div className="p-4">
      <CodeCommandUI code={exampleCode} command={exampleCommand} />
    </div>
  );
}
