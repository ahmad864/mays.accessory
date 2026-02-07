"use client";

import React from "react";

interface CardTitleProps {
  children: React.ReactNode;
}

const CardTitle = ({ children }: CardTitleProps) => {
  return <h2 className="text-xl font-bold mb-1">{children}</h2>;
};

export default CardTitle;
