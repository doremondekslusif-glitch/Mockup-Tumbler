'use client';

import { ChangeEvent, PointerEvent, useEffect, useRef, useState } from "react";

const BASE_PATH = "/Mockup-Tumbler";

const TUMBLERS = [
  { id: "arizona-500-merah", name: "Arizona 500 merah", image: `${BASE_PATH}/ARIZONA%20500%20MERAH.png` },
];

function WarpedDesign({src,scale,rotation,position,onPointerDown,onPointerMove,onPointerUp,dragging}:{src:string;scale:number;rotation:number;position:{x:number;y:number};onPointerDown:(e:PointerEvent<HTMLCanvasElement>)=>void;onPointerMove:(e:PointerEvent<HTMLCanvasElement>)=>void;onPointerUp:()=>void;dragging:boolean}) {
  const canvasRef=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas||!src)return;
    const ctx=canvas.getContext("2d");
    if(!ctx)return;
    const rect=canvas.getBoundingClientRect();
    const dpr=window.devicePixelRatio||1;
    const w=Math.max(1,Math.round(rect.width*dpr));
    const h=Math.max(1,Math.round(rect.height*dpr));
    canvas.width=w; canvas.height=h;
    ctx.clearRect(0,0,w,h);

    const image=new Image();
    image.onload=()=>{
      const designW=rect.width*(scale/100);
      const ratio=image.naturalHeight/image.naturalWidth;
      const designH=Math.min(rect.height*0.92,designW*ratio);

      // Add transparent padding around the artwork before rotating it.
      // This prevents the rotated corners from being clipped by the
      // temporary canvas itself.
      const angle=Math.abs((rotation%180)*Math.PI/180);
      const sin=Math.abs(Math.sin(angle));
      const cos=Math.abs(Math.cos(angle));
      const rotatedW=designW*cos+designH*sin;
      const rotatedH=designW*sin+designH*cos;
      const pad=Math.max(8,Math.ceil(Math.max(designW,designH)*0.03));
      const off=document.createElement("canvas");
      off.width=Math.max(1,Math.ceil((rotatedW+pad*2)*dpr));
      off.height=Math.max(1,Math.ceil((rotatedH+pad*2)*dpr));
      const oc=off.getContext("2d");
      if(!oc)return;
      oc.save();
      oc.translate(off.width/2,off.height/2);
      oc.rotate(rotation*Math.PI/180);
      oc.drawImage(image,-designW*dpr/2,-designH*dpr/2,designW*dpr,designH*dpr);
      oc.restore();

      const centerX=w/2+position.x*dpr;
      const centerY=h/2+position.y*dpr;
      const halfW=off.width/2;
      const radius=Math.max(halfW*1.45,halfW+1);

      ctx.clearRect(0,0,w,h);
      for(let x=0;x<w;x++){
        const nx=(x-centerX)/radius;
        if(Math.abs(nx)>=1)continue;
        const theta=Math.asin(nx);
        const sourceX=(theta/Math.asin(Math.min(0.999,halfW/radius))+1)/2*off.width;
        const columnW=Math.max(1,Math.ceil((radius*Math.cos(theta))/Math.max(1,halfW)));
        if(sourceX<0||sourceX>=off.width)continue;
        const sx=Math.max(0,Math.min(off.width-1,sourceX-columnW/2));
        const sw=Math.min(off.width-sx,Math.max(1,columnW));
        ctx.drawImage(off,sx,0,sw,off.height,x,centerY-off.height/2,Math.max(1,columnW),off.height);
      }
    };
    image.src=src;
  },[src,scale,rotation,position.x,position.y]);

  return <canvas ref={canvasRef} className="warped-design" style={{cursor:dragging?"grabbing":"grab"}} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}/>;
}

export default function Home() {
  const [selectedTumbler, setSelectedTumbler] = useState(TUMBLERS[0]);
  const [design,setDesign]=useState({src:"",name:""});
  const [scale,setScale]=useState(58);
  const [rotation,setRotation]=useState(0);
  const [position,setPosition]=useState({x:0,y:0});
  const [dragging,setDragging]=useState(false);
  const fileRef=useRef<HTMLInputElement>(null);
  const dragStart=useRef({x:0,y:0});

  function uploadDesign(e:ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0]; if(!file)return;
    setDesign({src:URL.createObjectURL(file),name:file.name});
    setPosition({x:0,y:0});
  }
  function resetEditor(){setScale(58);setRotation(0);setPosition({x:0,y:0});}
  function onPointerDown(e:PointerEvent<HTMLCanvasElement>){
    if(!design.src)return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current={x:e.clientX-position.x,y:e.clientY-position.y};
    setDragging(true);
  }
  function onPointerMove(e:PointerEvent<HTMLCanvasElement>){
    if(!dragging)return;
    setPosition({x:e.clientX-dragStart.current.x,y:e.clientY-dragStart.current.y});
  }
  function onPointerUp(){setDragging(false);}
  function downloadPreview(){alert("Fitur download PNG akan kita aktifkan pada tahap berikutnya.");}

  return <main className="page-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">MT</div><div><strong>Mockup Tumbler</strong><span>Mockup generator sederhana</span></div></div>
      <button className="header-button" onClick={resetEditor}>Reset</button>
    </header>

    <section className="hero">
      <div><p className="eyebrow">TAHAP 2 · PILIH TUMBLER</p><h1>Buat mockup tumbler<br/><span>tanpa ribet.</span></h1><p className="hero-copy">Pilih model tumbler yang tersedia, masukkan desainmu, lalu atur ukuran, posisi, dan rotasinya.</p></div>
      <div className="hero-badge"><span>●</span> Editor siap digunakan</div>
    </section>

    <section className="workspace">
      <aside className="panel controls-panel">
        <div className="panel-heading"><div><p className="panel-kicker">01</p><h2>Pilih Tumbler</h2></div></div>
        <div className="tumbler-catalog">
          {TUMBLERS.map(tumbler=><button key={tumbler.id} className={"tumbler-card "+(selectedTumbler.id===tumbler.id?"active":"")} onClick={()=>{setSelectedTumbler(tumbler);resetEditor();}}>
            <div className="catalog-image"><img src={tumbler.image} alt={tumbler.name}/></div>
            <div><strong>{tumbler.name}</strong><small>{selectedTumbler.id===tumbler.id?"Dipilih":"Pilih model"}</small></div>
          </button>)}
        </div>

        <div className="panel-divider"/>
        <div className="panel-heading"><div><p className="panel-kicker">02</p><h2>Desain</h2></div></div>
        <button className="upload-box" onClick={()=>fileRef.current?.click()}><span className="upload-icon">＋</span><strong>{design.src?"Ganti desain":"Upload desain"}</strong><small>PNG, JPG, SVG</small></button>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden onChange={uploadDesign}/>
        {design.src&&<div className="file-chip"><div className="file-thumb"><img src={design.src} alt=""/></div><div className="file-info"><strong>{design.name}</strong><span>Desain aktif</span></div></div>}
        <div className="control-group"><div className="control-label"><span>Ukuran</span><output>{scale}%</output></div><input className="range" type="range" min="20" max="100" value={scale} onChange={e=>setScale(Number(e.target.value))}/></div>
        <div className="control-group"><div className="control-label"><span>Rotasi</span><output>{rotation}°</output></div><input className="range" type="range" min="-180" max="180" value={rotation} onChange={e=>setRotation(Number(e.target.value))}/></div>
        <button className="secondary-button" onClick={resetEditor}>Kembalikan posisi</button>
      </aside>

      <section className="panel preview-panel">
        <div className="preview-header"><div><p className="panel-kicker">03</p><h2>Preview mockup</h2></div><span className="preview-status">LIVE</span></div>
        <div className="canvas-wrap">
          <div className="mockup-stage">
            <div className="tumbler-image-wrap">
              <img className="tumbler-image" src={selectedTumbler.image} alt={selectedTumbler.name}/>
              <div className="print-overlay"><div className="surface-guide" aria-hidden="true"/>
                {design.src?<WarpedDesign src={design.src} scale={scale} rotation={rotation} position={position} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} dragging={dragging}/>
                :<div className="empty-print"><span>＋</span><strong>Letakkan desain di sini</strong><small>Upload desain untuk mulai mengedit</small></div>}
              </div>
            </div>
            <div className="tumbler-shadow"/>
          </div>
        </div>
        <div className="preview-tip"><span>✦</span>{design.src?"Tekan dan geser desain untuk mengatur posisinya.":"Upload desain dari panel kiri untuk mulai."}</div>
      </section>

      <aside className="panel settings-panel">
        <div className="panel-heading"><div><p className="panel-kicker">04</p><h2>Ekspor</h2></div></div>
        <div className="setting-card"><span className="setting-icon">▣</span><div><strong>{selectedTumbler.name}</strong><small>Mockup tumbler aktif</small></div></div>
        <div className="format-row"><span>Format</span><strong>PNG</strong></div>
        <div className="format-row"><span>Resolusi</span><strong>HD</strong></div>
        <button className="download-button" onClick={downloadPreview}>Download mockup <span>↓</span></button>
        <p className="small-note">Fitur ekspor gambar final akan disempurnakan di tahap berikutnya.</p>
      </aside>
    </section>
    <footer>Mockup Tumbler · Tahap 2</footer>
  </main>;
}