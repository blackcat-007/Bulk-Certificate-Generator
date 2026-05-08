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
      <div className="
      absolute
      left-1/2
      top-0
      w-px
      h-full
      bg-red-500/30
      pointer-events-none
      z-20
      " />

      <div className="
      absolute
      top-1/2
      left-0
      h-px
      w-full
      bg-red-500/30
      pointer-events-none
      z-20
      " />

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
        "
      />

      {/* FIELDS */}
      {fields.map((field, index) => (

        <Rnd
          key={field.id}

          size={{
            width: field.width,
            height: field.height,
          }}

          position={{
            x: field.x,
            y: field.y,
          }}

          onDragStop={(e, d) => {

            const updated = [...fields];

            const centerX =
              displaySize.width / 2 -
              field.width / 2;

            if (
              Math.abs(d.x - centerX) < 10
            ) {
              updated[index].x =
                centerX;
            } else {
              updated[index].x = d.x;
            }

            updated[index].y = d.y;

            setFields(updated);
          }}

          onResizeStop={(
            e,
            direction,
            ref,
            delta,
            position
          ) => {

            const updated = [...fields];

            updated[index].width =
              parseInt(ref.style.width);

            updated[index].height =
              parseInt(ref.style.height);

            updated[index].x =
              position.x;

            updated[index].y =
              position.y;

            setFields(updated);
          }}
        >

          <div
            className="
            w-full
            h-full
            flex
            items-center
            justify-center
            border-2
            border-dashed
            border-blue-400
            bg-blue-500/10
            rounded-xl
            backdrop-blur-sm
            select-none
            "
            style={{
              fontSize: field.fontSize,

              color: field.color,

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
            }}
          >
            {field.value}
          </div>

        </Rnd>

      ))}

    </div>
  );
}