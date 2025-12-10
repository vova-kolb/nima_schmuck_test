"use client";

import { useMemo, useRef, useState } from "react";
import WorkshopsList from "./WorkshopsList";
import WorkshopBookingForm from "./WorkshopBookingForm";

export default function WorkshopsContent({ workshops = [] }) {
  const formRef = useRef(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState("");

  const hasWorkshops = useMemo(() => Array.isArray(workshops) && workshops.length > 0, [workshops]);

  const handleBookClick = (name) => {
    setSelectedWorkshop(name || "");
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <WorkshopsList workshops={workshops} onBook={handleBookClick} />
      <WorkshopBookingForm
        formRef={formRef}
        selectedWorkshop={selectedWorkshop}
        hasWorkshops={hasWorkshops}
      />
    </>
  );
}
