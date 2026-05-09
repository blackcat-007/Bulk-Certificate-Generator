"use client";

import { useState } from "react";
import { parseExcel } from "@/lib/excel";
import { detectNameColumn } from "@/lib/detectNameColumn";
import { formatName } from "@/lib/formatName";
import CertificateEditor from "@/components/CertificateEditor";

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

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      "certificates.zip";

    a.click();

  } catch (err) {

    console.error(err);

    alert(
      "Failed to generate certificates"
    );

  } finally {

    setLoading(false);
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

      </div>

    </div>

    {/* RIGHT SECTION */}
    <div className="
    flex
    items-center
    gap-3
    ">

      {/* PREVIEW BUTTON */}
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
      </button>

      {/* GENERATE BUTTON */}
    <button
  onClick={handleGenerate}
  disabled={loading}
  className="
  px-6 md:px-8
  py-3
  rounded-2xl
  bg-linear-to-r
  from-cyan-500
  to-blue-600
  transition-all duration-300
  font-semibold
  shadow-xl shadow-cyan-500/20
  disabled:opacity-60
  disabled:cursor-not-allowed
  flex items-center gap-3
  "
>

  {loading && (

    <div className="
    h-5 w-5
    border-2
    border-white/30
    border-t-white
    rounded-full
    animate-spin
    " />

  )}

  {loading
    ? "Generating..."
    : "Generate"}

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
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];

                    if (file)
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