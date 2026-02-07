"use client";

import React from "react";

interface CardDescriptionProps {
  children: React.ReactNode;
}

const CardDescription = ({ children }: CardDescriptionProps) => {
  return <p className="text-gray-600">{children}</p>;
};

export default CardDescription;
