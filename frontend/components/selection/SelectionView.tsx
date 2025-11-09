"use client";

import { SelectionInfo } from "./SelectionInfo";
import { GoToDashboardButton } from "./GoToDashboardButton";

/**
 * Vista completa de selección de países
 * Combina el texto informativo y el botón de dashboard
 */
export function SelectionView() {
  return (
    <>
      <SelectionInfo />
      <GoToDashboardButton />
    </>
  );
}
