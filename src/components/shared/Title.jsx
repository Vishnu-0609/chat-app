import React from 'react';
import {Helmet} from "react-helmet-async";

function Title({title="Chat",description="this is the Chat App"}) {
  return <Helmet>
    <title>{title}</title>
    <meta name='description'content={description}/>
  </Helmet>
}

export default Title
