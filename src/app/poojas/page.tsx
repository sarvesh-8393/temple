import React, { Suspense } from "react";
import PoojasPageContent from "./PoojasPageContent";

export default function PoojasPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PoojasPageContent />
    </Suspense>
  );
}
