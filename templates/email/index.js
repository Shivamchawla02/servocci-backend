import welcome from "./welcome.js";
import followUp from "./followUp.js";
import admissionStarted from "./admissionStarted.js";
import documentsRequired from "./documentsRequired.js";
import feeReminder from "./feeReminder.js";

const emailTemplates = {
  welcome,
  "follow-up": followUp,
  "admission-started": admissionStarted,
  "documents-required": documentsRequired,
  "fee-reminder": feeReminder,
};

export default emailTemplates;