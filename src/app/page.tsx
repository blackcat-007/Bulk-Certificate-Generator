"use client";

import { useState } from "react";
import { parseExcel } from "@/lib/excel";
import { detectNameColumn } from "@/lib/detectNameColumn";
import { formatName } from "@/lib/formatName";
import CertificateEditor from "@/components/CertificateEditor";
import { Span } from "next/dist/trace";

export default function HomePage() {
  const [certificate, setCertificate] =
    useState<File | null>(null);

  const [excelData, setExcelData] = useState<any[]>([]);

  const [sampleName, setSampleName] =
    useState("Sample Name");

  const [displaySize, setDisplaySize] =
    useState({
      width: 0,
      height: 0,
    });
    const [loading, setLoading] =useState(false);
   
const [progress, setProgress] =useState(0);


const [generatedCount, setGeneratedCount] =
  useState(0);

const [totalCertificates, setTotalCertificates] =
  useState(0);
  const [fields, setFields] = useState([
    {
      id: 1,

      type: "name",

      label: "Name",

      value: "Sample Name",

      x: 250,
      y: 250,

      width: 320,
      height: 80,

      fontSize: 48,

      color: "#111111",

      fontFamily: "Helvetica",

      bold: true,

      italic: false,
    },
  ]);

  const fonts = [
    "Helvetica",
    "TimesRoman",
    "Courier",
  ];

  const handleExcelUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const data: any[] = await parseExcel(file);

    if (!data.length) return;

    const columns = Object.keys(data[0]);

    const nameColumn =
      detectNameColumn(columns);

    if (!nameColumn) {
      alert("Name column not found");
      return;
    }

    const formatted = data.map((item) => ({
      ...item,

      [nameColumn]: formatName(
        item[nameColumn]
      ),
    }));

    setExcelData(formatted);

    const firstName =
      formatted[0][nameColumn];

    setSampleName(firstName);

    const updated = [...fields];

    updated[0].value = firstName;

    setFields(updated);
  };

 const handleGenerate = async () => {

  if (!certificate) return;

  try {

    setLoading(true);

    setProgress(0);

    setGeneratedCount(0);

    setTotalCertificates(
      excelData.length
    );

    let current = 0;

    let generated = 0;

    const interval = setInterval(() => {

      current += Math.random() * 8;

      if (current >= 90) {
        current = 90;
      }

      generated += Math.floor(
        Math.random() * 5
      );

      if (
        generated >=
        excelData.length
      ) {
        generated =
          excelData.length;
      }

      setGeneratedCount(generated);

      setProgress(
        Math.floor(current)
      );

    }, 400);

    const formData = new FormData();

    formData.append(
      "certificate",
      certificate
    );

    formData.append(
      "data",
      JSON.stringify(excelData)
    );

    formData.append(
      "fields",
      JSON.stringify(fields)
    );

    formData.append(
      "displaySize",
      JSON.stringify(displaySize)
    );

    const res = await fetch(
      "/api/generate",
      {
        method: "POST",
        body: formData,
      }
    );

    const blob = await res.blob();

    clearInterval(interval);

    setGeneratedCount(
      excelData.length
    );

    setProgress(100);

    setTimeout(() => {

      const url =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        "certificates.zip";

      a.click();

      setLoading(false);

      setProgress(0);

      setGeneratedCount(0);

    }, 700);

  } catch (err) {

    console.error(err);

    setLoading(false);

    setProgress(0);

    setGeneratedCount(0);

    alert(
      "Failed to generate certificates"
    );
  }
};
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black text-white">

      {/* HEADER */}
    {/* HEADER */}
<header className="
sticky top-0 z-50
border-b border-white/10
bg-black/30
backdrop-blur-2xl
">

  <div className="
  max-w-7xl
  mx-auto
  px-6
  py-5
  flex
  items-center
  justify-between
  gap-6
  ">

    {/* LEFT SECTION */}
    <div className="
    flex
    items-center
    gap-5
    ">

      {/* LOGO */}
      <div className="relative group">

        {/* GLOW */}
        <div className="
        absolute
        inset-0
        bg-cyan-500/20
        blur-2xl
        rounded-full
        scale-110
        opacity-80
        " />

        <img
          src="/glyph logo.png"
          alt="Glyph Logo"
          className="
          relative
          h-20 md:h-32
          w-auto
          object-contain
          drop-shadow-[0_0_25px_rgba(34,211,238,0.35)]
          "
        />

      </div>

      {/* TEXT */}
      <div>

        <h3 className="
        text-xl md:text-2xl
        font-black
        tracking-tight
        bg-linear-to-r
        from-cyan-300
        to-blue-500
        bg-clip-text
        text-transparent
        ">
           Bulk Certificate Generator
        </h3>

         {/* SUBTITLE */}
    <p className="
    mt-3
    text-slate-400
    text-sm md:text-base
    max-w-xl
    leading-relaxed
    ">
      Upload certificate templates, drag and position fields,
      customize fonts and colors, and generate certificates instantly.
     
    </p>
    <span className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
      generate upto 200 certificates in bulk with a single click.
    </span>
      </div>

    </div>

    {/* RIGHT SECTION */}
    <div className="
    flex
    items-center
    gap-3
    ">

      {/* PREVIEW BUTTON 
      <button
        className="
        hidden md:flex
        items-center
        justify-center
        px-6 py-3
        rounded-2xl
        border border-white/10
        bg-white/5
        hover:bg-white/10
        transition-all duration-300
        font-medium
        "
      >
        Preview
      </button>*/}

      {/* GENERATE BUTTON */}
 <button
  onClick={handleGenerate}
  disabled={loading}
  className="
  relative
  overflow-hidden
  min-w-64
  h-20
  rounded-xl
  border border-cyan-400/20
  bg-cyan-950/30
  hover:bg-cyan-800/50
  shadow-[0_0_40px_rgba(34,211,238,0.12)]
  transition-all duration-300
  disabled:cursor-not-allowed
  group
  "
>

  {/* LIQUID FILL */}
  <div
    className="
    absolute
    bottom-0
    left-0
    w-full
    bg-linear-to-t
    from-cyan-500
    via-blue-500
    to-cyan-300
    transition-all duration-500
    "
    style={{
      height: `${progress}%`,
    }}
  >

    {/* WAVE 1 */}
    <div className="
    absolute
    -top-5
    left-[-50%]
    w-[200%]
    h-10
    bg-white/20
    rounded-[100%]
    blur-xl
    animate-waveSlow
    " />

    {/* WAVE 2 */}
    <div className="
    absolute
    -top-2.5
    left-[-40%]
    w-[180%]
    h-7.5
    bg-cyan-100/20
    rounded-[100%]
    blur-lg
    animate-waveFast
    " />

  </div>

  {/* SHINE */}
  <div className="
  absolute
  inset-0
  bg-linear-to-r
  from-transparent
  via-white/5
  to-transparent
  -translate-x-full
  group-hover:translate-x-full
  transition-all duration-1000
  " />

  {/* CONTENT */}
  <div className="
  relative
  z-10
  flex
  flex-col
  items-center
  justify-center
  h-full
  px-6
  ">

    {!loading ? (

      <>
        <span className="
        text-white
        font-bold
        text-md
        tracking-wide
        ">
          Generate Certificates
        </span>

        <span className="
        text-slate-400
        text-xs
        mt-1
        ">
          Bulk PDF Export
        </span>
      </>

    ) : (

      <>
        <span className="
        text-white
        font-bold
        text-md
        tracking-wide
        ">
          Generating...
        </span>

        <span className="
        text-cyan-100
        text-sm
        mt-1
        ">

          {generatedCount} / {totalCertificates}
          {" "}
          Certificates

        </span>

        <span className="
        text-white/90
        text-xs
        mt-1
        font-medium
        ">

          {progress}%

        </span>
      </>

    )}

  </div>

</button>

    </div>

  </div>

</header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto p-6">

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">

          {/* SIDEBAR */}
          <div className="
          bg-white/5
          border border-white/10
          backdrop-blur-xl
          rounded-3xl
          p-6
          h-fit
          ">

            <h2 className="text-2xl font-bold mb-8">
              Controls
            </h2>

            {/* CERTIFICATE */}
            <div className="mb-6">

              <label className="block mb-3 text-slate-300">
                Certificate Image
              </label>

              <label className="
              flex items-center justify-center
              border-2 border-dashed border-white/20
              hover:border-blue-400
              rounded-2xl
              p-8
              cursor-pointer
              transition
              bg-white/5
              ">

                <span className="text-sm text-slate-300 text-center">
                  Upload Certificate Template
                  <p className="text-xs text-slate-400/50 text-center">
                    (JPG, JPEG, PNG) OF 5MB OR LESS
                  </p>
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];
                    if (!file) return;

                    if (file.size > 5 * 1024 * 1024) {
                      alert("Image too large");
                      return;
                    }

                    setCertificate(file);
                  }}
                />

              </label>

            </div>

            {/* EXCEL */}
            <div className="mb-6">

              <label className="block mb-3 text-slate-300">
                Excel Sheet
              </label>

              <label className="
              flex items-center justify-center
              border-2 border-dashed border-white/20
              hover:border-green-400
              rounded-2xl
              p-8
              cursor-pointer
              transition
              bg-white/5
              ">

                <span className="text-sm text-slate-300 text-center">
                  Upload Excel File
                  <p className="text-xs text-slate-400/50 text-center">
                    (XLSX, XLS) OF MAX DATA 200 ROWS
                  </p>
                </span>

                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleExcelUpload}
                />

              </label>

            </div>

            {/* FIELD SETTINGS */}
            <div className="space-y-6">

              <div>

                <div className="flex justify-between mb-3">
                  <span>Font Size</span>

                  <span className="text-blue-400">
                    {fields[0].fontSize}px
                  </span>
                </div>

                <input
                  type="range"
                  min={20}
                  max={100}
                  value={fields[0].fontSize}
                  onChange={(e) => {

                    const updated = [...fields];

                    updated[0].fontSize =
                      Number(e.target.value);

                    setFields(updated);
                  }}
                  className="w-full accent-blue-500"
                />

              </div>

              {/* COLOR */}
              <div>

                <label className="block mb-3">
                  Text Color
                </label>

                <input
                  type="color"
                  value={fields[0].color}
                  onChange={(e) => {

                    const updated = [...fields];

                    updated[0].color =
                      e.target.value;

                    setFields(updated);
                  }}
                  className="w-full h-14 rounded-xl cursor-pointer"
                />

              </div>

              {/* FONT FAMILY */}
              <div>

                <label className="block mb-3">
                  Font Family
                </label>

                <select
                  value={fields[0].fontFamily}
                  onChange={(e) => {

                    const updated = [...fields];

                    updated[0].fontFamily =
                      e.target.value;

                    setFields(updated);
                  }}
                  className="
                  w-full
                  bg-black/30
                  border border-white/10
                  rounded-xl
                  px-4 py-3
                  "
                >

                  {fonts.map((font) => (
                    <option
                      key={font}
                      value={font}
                    >
                      {font}
                    </option>
                  ))}

                </select>

              </div>

              {/* BOLD ITALIC */}
              <div className="flex gap-3">

                <button
                  onClick={() => {

                    const updated = [...fields];

                    updated[0].bold =
                      !updated[0].bold;

                    setFields(updated);
                  }}
                  className={`
                  flex-1
                  py-3
                  rounded-xl
                  border
                  transition
                  ${
                    fields[0].bold
                      ? "bg-blue-600 border-blue-500"
                      : "border-white/10 bg-white/5"
                  }
                  `}
                >
                  Bold
                </button>

                <button
                  onClick={() => {

                    const updated = [...fields];

                    updated[0].italic =
                      !updated[0].italic;

                    setFields(updated);
                  }}
                  className={`
                  flex-1
                  py-3
                  rounded-xl
                  border
                  transition
                  ${
                    fields[0].italic
                      ? "bg-blue-600 border-blue-500"
                      : "border-white/10 bg-white/5"
                  }
                  `}
                >
                  Italic
                </button>

              </div>

            </div>

          </div>

          {/* EDITOR */}
          <div className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-5
          overflow-auto
          ">

            <div className="mb-6">

              <h2 className="text-2xl font-bold">
                Live Editor
              </h2>

              <p className="text-slate-400 mt-2">
                Drag text to position fields
              </p>

            </div>

            {certificate ? (

              <CertificateEditor
                certificate={certificate}
                fields={fields}
                setFields={setFields}
                displaySize={displaySize}
                setDisplaySize={setDisplaySize}
              />

            ) : (

              <div className="
              h-150
              flex items-center justify-center
              text-slate-500
              ">
                Upload certificate template
              </div>

            )}

          </div>

        </div>

      </div>

    </main>
  );
}