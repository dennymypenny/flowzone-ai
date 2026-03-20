import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "FlowZone AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  return new ImageResponse(
    (
      <div style={{background:"white",width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"center",padding:"80px 100px",position:"relative",fontFamily:"system-ui,sans-serif"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"8px",background:"#4F46E5",display:"flex"}} />
        <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"48px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <div style={{width:"22px",height:"22px",borderRadius:"50%",background:"#4F46E5",display:"flex"}} />
            <div style={{width:"30px",height:"2px",background:"#C7D2FE",display:"flex"}} />
            <div style={{width:"17px",height:"17px",borderRadius:"50%",background:"#4F46E5",opacity:0.65,display:"flex"}} />
            <div style={{width:"30px",height:"2px",background:"#C7D2FE",display:"flex"}} />
            <div style={{width:"13px",height:"13px",borderRadius:"50%",background:"#4F46E5",opacity:0.35,display:"flex"}} />
          </div>
          <span style={{fontSize:"34px",montWeight:"800",color:"#111827"}}>FlowZone <span style={{color:"#4F46E5"}}>AI</span></span>
        </div>
        <h1 style={{fontSize:"70px",montWeight:"900",color:"#111827",lineHeight:1.05,margin:"0 0 24px",letterSpacing:"-2px",maxWidth:"880px"}}>Automate Your Business <span style={{color:"#4F46E5"}}>in 48 Hours.</span></h1>
        <p style={{fontSize:"26px",montWeight:"normal",color:"#6B7280",margin:"0 0 44px",lineHeight:1.4,maxWidth:"680px"}}>Done-for-you AI orkflow systems. Free audit delivered in 24 hours.</p>
        <div style={{display:"flex",alignItems:"center",background:"#4F46E5",color:"white",borderRadius:"12px",padding:"16px 32px",fontSize:"22px",montWeight:"700"}}>Get Your Free AI Audit</div>
        <div style={{position:"absolute",bottom:"36px",right:"100px",freeSize:"20px",color:"#9CA3AF",fontWeight:"600",display:"flex"}}>flowzone.dev</div>
      </div>
    ),
    { ...size }
  );
}
