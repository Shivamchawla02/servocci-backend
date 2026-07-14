const feeReminder = (student) => {
  return {

    subject: "Fee Payment Reminder",

    html: `
      <div style="font-family:Arial;padding:25px">

      <h2>Hello ${student.fullName}</h2>

      <p>

      This is a gentle reminder regarding your admission fee.

      Please contact your counsellor if you have already completed the payment.

      </p>

      <br>

      Regards,

      <br>

      Servocci Counsellors

      </div>
    `,
  };
};

export default feeReminder;