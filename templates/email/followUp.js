const followUp = (student) => {
  return {

    subject: "Admission Follow Up",

    html: `
      <div style="font-family:Arial;padding:25px">

      <h2>Hello ${student.fullName}</h2>

      <p>

      We tried contacting you regarding your admission.

      Kindly connect with your counsellor.

      </p>

      <br>

      Regards,

      <br>

      Servocci Counsellors

      </div>
    `,
  };
};

export default followUp;