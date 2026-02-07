"use client";

import React from "react";

interface CardHeaderProps {
  children: React.ReactNode;
}

const CardHeader = ({ children }: CardHeaderProps) => {
  return <div className="mb-4">{children}</div>;
};

export default CardHeader;
