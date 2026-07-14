const welcome = (student) => {
  return {

    subject: "Welcome to Servocci Counsellors",

    html: `
      <div style="font-family:Arial;padding:25px">

      <h2>

      Welcome ${student.fullName}

      </h2>

      <p>

      Thank you for choosing Servocci Counsellors.

      We look forward to helping you achieve your academic goals.

      </p>

      <br>

      Regards,

      <br>

      Team Servocci

      </div>
    `,
  };
};

export default welcome;