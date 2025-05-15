import React from "react";

let mockCaptchaValue = "test-captcha-value";

const ReCAPTCHA = React.forwardRef((props, ref) => {
  if (ref) {
    ref.current = {
      getValue: () => mockCaptchaValue,
    };
  }
  return <div data-testid="recaptcha">Mocked ReCAPTCHA</div>;
});

ReCAPTCHA.setMockCaptchaValue = (value) => {
  mockCaptchaValue = value;
};

export default ReCAPTCHA;
