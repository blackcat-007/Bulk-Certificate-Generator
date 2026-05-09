export const runtime = "nodejs";

export const maxDuration = 60;

import JSZip from "jszip";

import {
  PDFDocument,
  rgb,
  StandardFonts,
} from "pdf-lib";

export async function POST(
  req: Request
) {
  try {

    const formData =
      await req.formData();

    const certificate =
      formData.get(
        "certificate"
      ) as File;

    if (!certificate) {

      return new Response(
        JSON.stringify({
          error:
            "Certificate image missing",
        }),
        {
          status: 400,
        }
      );
    }

    const data = JSON.parse(
      formData.get(
        "data"
      ) as string
    );

    const fields = JSON.parse(
      formData.get(
        "fields"
      ) as string
    );

    const displaySize =
      JSON.parse(
        formData.get(
          "displaySize"
        ) as string
      );

    const imageBytes =
      await certificate.arrayBuffer();

    const zip = new JSZip();

    for (const item of data) {

      try {

        const pdfDoc =
          await PDFDocument.create();

        let embeddedImage;

        // JPG / PNG SUPPORT
        try {

          embeddedImage =
            await pdfDoc.embedJpg(
              imageBytes
            );

        } catch {

          embeddedImage =
            await pdfDoc.embedPng(
              imageBytes
            );
        }

        const imageWidth =
          embeddedImage.width;

        const imageHeight =
          embeddedImage.height;

        const page =
          pdfDoc.addPage([
            imageWidth,
            imageHeight,
          ]);

        // DRAW CERTIFICATE IMAGE
        page.drawImage(
          embeddedImage,
          {
            x: 0,
            y: 0,
            width: imageWidth,
            height: imageHeight,
          }
        );

        // SCALE FACTORS
        const scaleX =
          imageWidth /
          displaySize.width;

        const scaleY =
          imageHeight /
          displaySize.height;

        // DRAW FIELDS
        for (const field of fields) {

          let value = String(
            field.value || ""
          );

          // DYNAMIC NAME
          if (
            field.type === "name"
          ) {

            const nameKey =
              Object.keys(item).find(
                (k) =>
                  k
                    .toLowerCase()
                    .includes(
                      "name"
                    )
              );

            value = String(
              nameKey
                ? item[nameKey]
                : "Unknown"
            );
          }

          // POSITION
          const realX =
            field.x * scaleX;

          // SCALE FONT SIZE
          const scaledFontSize =
            field.fontSize *
            scaleY;

          // PDF Y POSITION FIX
          const realY =
            imageHeight -
            (field.y * scaleY) -
            scaledFontSize;

          // FONT SELECTION
          let selectedFont;

          // COURIER
          if (
            field.fontFamily ===
            "Courier"
          ) {

            if (
              field.bold &&
              field.italic
            ) {

              selectedFont =
                StandardFonts.CourierBoldOblique;

            } else if (
              field.bold
            ) {

              selectedFont =
                StandardFonts.CourierBold;

            } else if (
              field.italic
            ) {

              selectedFont =
                StandardFonts.CourierOblique;

            } else {

              selectedFont =
                StandardFonts.Courier;
            }

          }

          // TIMES
          else if (
            field.fontFamily ===
            "TimesRoman"
          ) {

            if (
              field.bold &&
              field.italic
            ) {

              selectedFont =
                StandardFonts.TimesRomanBoldItalic;

            } else if (
              field.bold
            ) {

              selectedFont =
                StandardFonts.TimesRomanBold;

            } else if (
              field.italic
            ) {

              selectedFont =
                StandardFonts.TimesRomanItalic;

            } else {

              selectedFont =
                StandardFonts.TimesRoman;
            }

          }

          // HELVETICA
          else {

            if (
              field.bold &&
              field.italic
            ) {

              selectedFont =
                StandardFonts.HelveticaBoldOblique;

            } else if (
              field.bold
            ) {

              selectedFont =
                StandardFonts.HelveticaBold;

            } else if (
              field.italic
            ) {

              selectedFont =
                StandardFonts.HelveticaOblique;

            } else {

              selectedFont =
                StandardFonts.Helvetica;
            }
          }

          const font =
            await pdfDoc.embedFont(
              selectedFont
            );

          // HEX → RGB
          const hex =
            field.color.replace(
              "#",
              ""
            );

          const r =
            parseInt(
              hex.substring(
                0,
                2
              ),
              16
            ) / 255;

          const g =
            parseInt(
              hex.substring(
                2,
                4
              ),
              16
            ) / 255;

          const b =
            parseInt(
              hex.substring(
                4,
                6
              ),
              16
            ) / 255;

          // DRAW TEXT
          page.drawText(
            String(value),
            {
              x: realX,

              y: realY,

              size:
                scaledFontSize,

              font,

              color: rgb(
                r,
                g,
                b
              ),
            }
          );
        }

        // FILE NAME
        const nameKey =
          Object.keys(item).find(
            (k) =>
              k
                .toLowerCase()
                .includes(
                  "name"
                )
          );

        const fileName =
          String(
            nameKey
              ? item[nameKey]
              : "certificate"
          );

        const pdfBytes =
          await pdfDoc.save();

        zip.file(
          `${fileName}.pdf`,
          pdfBytes
        );

      } catch (err) {

        console.error(
          "Certificate generation failed:",
          err
        );
      }
    }

    // ZIP GENERATION
    const zipBlob =
      await zip.generateAsync({
        type: "blob",
      });

    return new Response(
      zipBlob,
      {
        headers: {
          "Content-Type":
            "application/zip",

          "Content-Disposition":
            'attachment; filename="certificates.zip"',
        },
      }
    );

  } catch (err) {

    console.error(err);

    return new Response(
      JSON.stringify({
        error:
          "Certificate generation failed",
      }),
      {
        status: 500,
      }
    );
  }
}