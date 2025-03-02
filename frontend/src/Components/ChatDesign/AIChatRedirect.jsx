// import React from 'react'

// const AIChatRedirect = () => {
//   return (
//     <div>AIChatRedirect</div>
//   )
// }

// export default AIChatRedirect

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AIChatHome from "./AIChatHome";

const AIChatRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Define allowed IDs
  const allowedIds = ["prompt", "code-generate", "code-explain"];

  useEffect(() => {
    if (!allowedIds.includes(id)) {
      navigate("/chat/new", { replace: true });
    }
  }, [id, navigate]);

  return <AIChatHome />;
};

export default AIChatRedirect;
