const admissionStarted = (student) => {
  return {
    subject: "Your Admission Process has Started | Servocci Counsellors",

    html: `
      <div style="font-family:Arial;padding:25px;line-height:1.6">

      <h2 style="color:#001b48">
      Hello ${student.fullName},
      </h2>

      <p>

      We are pleased to inform you that your admission process has officially started.

      </p>

      <p>

      Your dedicated counsellor will guide you throughout the admission journey.

      </p>

      <br>

      <b>Registration Number</b>

      <br>

      ${student.regNumber || "-"}

      <br><br>

      Regards,

      <br>

      Servocci Counsellors

      </div>
    `,
  };
};

export default admissionStarted;