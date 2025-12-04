
import React from "react";

export default function CatalogLoading() {
  return (
    <div className="flex justify-center items-center py-8 sm:py-12 min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-serpente-600"></div>
    </div>
  );
}
