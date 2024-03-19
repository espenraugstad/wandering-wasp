import { Resend } from "resend";

const resendKey = import.meta.env.RESEND_KEY;

export const resend = new Resend(resendKey);