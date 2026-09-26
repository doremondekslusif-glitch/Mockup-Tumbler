'use client';

import { ChangeEvent, PointerEvent, useRef, useState } from "react";

export default function Home() {
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
  function onPointerDown(e:PointerEvent<HTMLDivElement>){
    if(!design.src)return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current={x:e.clientX-position.x,y:e.clientY-position.y};
    setDragging(true);
  }
  function onPointerMove(e:PointerEvent<HTMLDivElement>){
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
      <div><p className="eyebrow">TAHAP 1 · EDITOR</p><h1>Buat mockup tumbler<br/><span>tanpa ribet.</span></h1><p className="hero-copy">Masukkan desainmu, atur ukurannya, lalu geser sampai posisinya pas di area tumbler.</p></div>
      <div className="hero-badge"><span>●</span> Editor siap digunakan</div>
    </section>

    <section className="workspace">
      <aside className="panel controls-panel">
        <div className="panel-heading"><div><p className="panel-kicker">01</p><h2>Desain</h2></div></div>
        <button className="upload-box" onClick={()=>fileRef.current?.click()}><span className="upload-icon">＋</span><strong>{design.src?"Ganti desain":"Upload desain"}</strong><small>PNG, JPG, SVG</small></button>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden onChange={uploadDesign}/>
        {design.src&&<div className="file-chip"><div className="file-thumb"><img src={design.src} alt=""/></div><div className="file-info"><strong>{design.name}</strong><span>Desain aktif</span></div></div>}
        <div className="control-group"><div className="control-label"><span>Ukuran</span><output>{scale}%</output></div><input className="range" type="range" min="20" max="100" value={scale} onChange={e=>setScale(Number(e.target.value))}/></div>
        <div className="control-group"><div className="control-label"><span>Rotasi</span><output>{rotation}°</output></div><input className="range" type="range" min="-180" max="180" value={rotation} onChange={e=>setRotation(Number(e.target.value))}/></div>
        <button className="secondary-button" onClick={resetEditor}>Kembalikan posisi</button>
      </aside>

      <section className="panel preview-panel">
        <div className="preview-header"><div><p className="panel-kicker">02</p><h2>Preview mockup</h2></div><span className="preview-status">LIVE</span></div>
        <div className="canvas-wrap">
          <div className="mockup-stage"><div className="tumbler-shadow"/>
            <div className="tumbler">
              <div className="tumbler-lid"><span/></div>
              <div className="tumbler-body"><div className="tumbler-highlight"/>
                <div className="print-area">
                  {design.src?<div className="design-layer" style={{transform:"translate(calc(-50% + "+position.x+"px), calc(-50% + "+position.y+"px)) rotate("+rotation+"deg)",width:scale+"%",cursor:dragging?"grabbing":"grab"}} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}><img src={design.src} alt="Desain tumbler" draggable={false}/></div>
                  :<div className="empty-print"><span>＋</span><strong>Letakkan desain di sini</strong><small>Upload desain untuk mulai mengedit</small></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="preview-tip"><span>✦</span>{design.src?"Tekan dan geser desain untuk mengatur posisinya.":"Upload desain dari panel kiri untuk mulai."}</div>
      </section>

      <aside className="panel settings-panel">
        <div className="panel-heading"><div><p className="panel-kicker">03</p><h2>Ekspor</h2></div></div>
        <div className="setting-card"><span className="setting-icon">▣</span><div><strong>Mockup tumbler</strong><small>Preview transparan</small></div></div>
        <div className="format-row"><span>Format</span><strong>PNG</strong></div>
        <div className="format-row"><span>Resolusi</span><strong>HD</strong></div>
        <button className="download-button" onClick={downloadPreview}>Download mockup <span>↓</span></button>
        <p className="small-note">Fitur ekspor gambar final akan disempurnakan di tahap berikutnya.</p>
      </aside>
    </section>
    <footer>Mockup Tumbler · Tahap 1</footer>
  </main>;
}