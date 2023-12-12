import React, { useEffect } from "react";
import './Page403.css';

const Page403 = () => {

  useEffect(() => {
    window.scrollTo(0,280)
  })
  return (
    <div style={{
    backgroundColor: `#000121`
    }}>
 <div class="maincontainer">
  <div class="bat">
    <img class="wing leftwing" 
         src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png"/>
    <img class="body"
         src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-body.png" alt="bat"/>
    <img class="wing rightwing"
         src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png"/>
  </div>
  <div class="bat">
    <img class="wing leftwing" 
         src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png"/>
    <img class="body"
         src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-body.png" alt="bat"/>
    <img class="wing rightwing"
         src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png"/>
  </div>
  <div class="bat">
    <img class="wing leftwing" 
         src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png"/>
    <img class="body"
         src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-body.png" alt="bat"/>
    <img class="wing rightwing"
         src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png"/>
  </div>
  <img class="foregroundimg" src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/HauntedHouseForeground.png" alt="haunted house"/>
  
</div>
<h1 class="errorcode">ERROR 403</h1>
<div class="errortext">Bạn không có quyền truy cập hệ thống!</div>
    </div>
  );
};

export default Page403;
