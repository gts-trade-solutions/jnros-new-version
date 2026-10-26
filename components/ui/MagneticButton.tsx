"use client";

import { Button, type ButtonProps } from "./Button";
import { Magnetic } from "./Magnetic";

/** Primary call-to-action: a <Button> with the magnetic hover. */
export function MagneticButton({ strength = 0.3, ...props }: ButtonProps & { strength?: number }) {
  return (
    <Magnetic strength={strength}>
      <Button {...props} />
    </Magnetic>
  );
}
