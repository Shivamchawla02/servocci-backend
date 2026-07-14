const documentsRequired = (student) => {
  return {

    subject: "Documents Required",

    html: `
      <div style="font-family:Arial;padding:25px">

      <h2>Hello ${student.fullName}</h2>

      <p>

      Your admission process requires additional documents.

      Kindly upload them or contact your counsellor.

      </p>

      <br>

      Regards,

      <br>

      Servocci Counsellors

      </div>
    `,
  };
};

export default documentsRequired;