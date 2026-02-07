"use client";

import React from "react";

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDescription = ({ children, className }: AlertDescriptionProps) => {
  return <span className={className}>{children}</span>;
};

export default AlertDescription;
