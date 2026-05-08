import JSZip from "jszip";

import {
  PDFDocument,
  rgb,
  StandardFonts,
} from "pdf-lib";

export async function POST(
  req: Request
) {

  const formData =
    await req.formData();

  const certificate =
    formData.get(
      "certificate"
    ) as File;

  const data = JSON.parse(
    formData.get("data") as string
  );

  const fields = JSON.parse(
    formData.get("fields") as string
  );

  const displaySize = JSON.parse(
    formData.get(
      "displaySize"
    ) as string
  );

  const imageBytes =
    await certificate.arrayBuffer();

  const zip = new JSZip();

  for (const item of data) {

    const pdfDoc =
      await PDFDocument.create();

    const jpgImage =
      await pdfDoc.embedJpg(imageBytes);

    const imageWidth =
      jpgImage.width;

    const imageHeight =
      jpgImage.height;

    const scaleX =
      imageWidth /
      displaySize.width;

    const scaleY =
      imageHeight /
      displaySize.height;

    const page =
      pdfDoc.addPage([
        imageWidth,
        imageHeight,
      ]);

    page.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width: imageWidth,
      height: imageHeight,
    });

    for (const field of fields) {

      let value = field.value;

      if (
        field.type === "name"
      ) {

        const nameKey =
          Object.keys(item).find((k) =>
            k
              .toLowerCase()
              .includes("name")
          );

        value = item[nameKey!];
      }

      const realX =
        field.x * scaleX;

      const realY =
        imageHeight -
        (field.y * scaleY) -
        (field.fontSize *
          scaleY);

      let font;

      switch (
        field.fontFamily
      ) {

        case "Courier":

          font =
            await pdfDoc.embedFont(
              StandardFonts.Courier
            );

          break;

        case "TimesRoman":

          font =
            await pdfDoc.embedFont(
              StandardFonts.TimesRoman
            );

          break;

        default:

          font =
            await pdfDoc.embedFont(
              StandardFonts.Helvetica
            );
      }

      const hex =
        field.color.replace(
          "#",
          ""
        );

      const r =
        parseInt(
          hex.substring(0, 2),
          16
        ) / 255;

      const g =
        parseInt(
          hex.substring(2, 4),
          16
        ) / 255;

      const b =
        parseInt(
          hex.substring(4, 6),
          16
        ) / 255;

      page.drawText(value, {
        x: realX,

        y: realY,

        size:
          field.fontSize *
          scaleX,

        font,

        color: rgb(r, g, b),
      });
    }

    const nameKey =
      Object.keys(item).find((k) =>
        k
          .toLowerCase()
          .includes("name")
      );

    const pdfBytes =
      await pdfDoc.save();

    zip.file(
      `${item[nameKey!]}.pdf`,
      pdfBytes
    );
  }

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
}