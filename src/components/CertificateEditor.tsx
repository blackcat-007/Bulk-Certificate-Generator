"use client";

import { Rnd } from "react-rnd";

interface Props {
  certificate: File;

  fields: any[];

  setFields: any;

  displaySize: any;

  setDisplaySize: any;
}

export default function CertificateEditor({
  certificate,
  fields,
  setFields,
  displaySize,
  setDisplaySize,
}: Props) {

  const imageUrl =
    URL.createObjectURL(certificate);

  return (
    <div
      className="
      relative
      mx-auto
      w-fit
      max-w-full
      "
    >

      {/* CENTER GUIDES */}
      <div
        className="
        absolute
        left-1/2
        top-0
        w-px
        h-full
        bg-red-500/30
        pointer-events-none
        z-20
        "
      />

      <div
        className="
        absolute
        top-1/2
        left-0
        h-px
        w-full
        bg-red-500/30
        pointer-events-none
        z-20
        "
      />

      {/* IMAGE */}
      <img
        src={imageUrl}
        alt="certificate"
        onLoad={(e) => {

          setDisplaySize({
            width:
              e.currentTarget.clientWidth,

            height:
              e.currentTarget.clientHeight,
          });
        }}
        className="
        w-full
        h-auto
        object-contain
        rounded-2xl
        block
        "
      />

      {/* FIELDS */}
   {/* FIELDS */}
{fields.map((field, index) => (

  <Rnd
    key={field.id}

    bounds="parent"

    dragGrid={[1, 1]}

    enableResizing={false}

    size={{
      width: "auto",
      height: "auto",
    }}

    position={{
      x: field.x,
      y: field.y,
    }}

    onDragStop={(e, d) => {

      const updated = [...fields];

      updated[index].x = d.x;

      updated[index].y = d.y;

      setFields(updated);
    }}
  >

    <div
      className="
      group
      relative
      inline-block
      px-2
      py-1
      rounded-lg
      transition-all
      duration-200
      hover:bg-blue-500/10
      hover:ring-2
      hover:ring-blue-400/60
      cursor-move
      "
    >

      {/* DRAG INDICATOR */}
      <div
        className="
        absolute
        -top-2
        -right-2
        w-3
        h-3
        rounded-full
        bg-blue-500
        opacity-0
        group-hover:opacity-100
        transition
        shadow-[0_0_10px_rgba(59,130,246,0.8)]
        "
      />

      {/* TEXT */}
      <div
        className="
        whitespace-nowrap
        select-none
        "
        style={{

          fontSize:
            `${field.fontSize}px`,

          color:
            field.color,

          fontFamily:
            field.fontFamily,

          fontWeight:
            field.bold
              ? "bold"
              : "normal",

          fontStyle:
            field.italic
              ? "italic"
              : "normal",

          lineHeight: 1,

          padding: 0,

          margin: 0,
        }}
      >

        {field.value}

      </div>

    </div>

  </Rnd>

))}

    </div>
  );
}