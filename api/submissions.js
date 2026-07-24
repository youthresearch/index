import { Resend } from "resend";

export const config = {
  api: {
    bodyParser: false,
  },
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const formData = await req.formData();

    const title = formData.get("ms-title");
    const msType = formData.get("ms-type");
    const field = formData.get("field");

    const authorFirst = formData.get("author-first");
    const authorLast = formData.get("author-last");
    const authorEmail = formData.get("author-email");

    const school = formData.get("school");
    const grade = formData.get("grade");

    const abstract = formData.get("abstract");
    const keywords = formData.get("keywords");

    const manuscript = formData.get("file-manuscript");
    const supporting = formData.get("file-supporting");


    const attachments = [];


    if (manuscript && manuscript.size > 0) {

      const buffer = Buffer.from(
        await manuscript.arrayBuffer()
      );

      attachments.push({
        filename: manuscript.name,
        content: buffer,
      });

    }


    if (supporting && supporting.size > 0) {

      const buffer = Buffer.from(
        await supporting.arrayBuffer()
      );

      attachments.push({
        filename: supporting.name,
        content: buffer,
      });

    }


    await resend.emails.send({

      from: "YRP Journal <publish@youthresearchproject.com>",

      to: [
        "publish@youthresearchproject.com"
      ],

      replyTo: authorEmail,


      subject: `New YRP Journal Submission: ${title}`,


      text: `
NEW YRP JOURNAL SUBMISSION


MANUSCRIPT DETAILS

Title:
${title}

Submission Type:
${msType}

Research Field:
${field}


AUTHOR INFORMATION

Name:
${authorFirst} ${authorLast}

Email:
${authorEmail}

School:
${school}

Grade:
${grade}


KEYWORDS:
${keywords}


ABSTRACT:
${abstract}
      `,


      attachments

    });


    return res.status(200).json({
      success: true
    });


  } catch (error) {

    console.error("Submission error:", error);


    return res.status(500).json({
      error: "Submission failed"
    });

  }

}
