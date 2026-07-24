import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {

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

      attachments.push({

        filename: manuscript.name,

        content: Buffer.from(
          await manuscript.arrayBuffer()
        )

      });

    }


    if (supporting && supporting.size > 0) {

      attachments.push({

        filename: supporting.name,

        content: Buffer.from(
          await supporting.arrayBuffer()
        )

      });

    }



    await resend.emails.send({

      from:
      "YRP Journal <publish@youthresearchproject.com>",


      to:
      ["publish@youthresearchproject.com"],


      replyTo:
      authorEmail,


      subject:
      `New YRP Journal Submission: ${title}`,


      text:

`
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



    return Response.json({

      success:true

    });



  } catch(error) {


    console.error(error);


    return Response.json(

      {
        error:"Submission failed"
      },

      {
        status:500
      }

    );


  }

}
