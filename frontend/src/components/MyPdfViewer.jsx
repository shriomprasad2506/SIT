import React, { useState, useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

// Set the workerSrc to the pdf.worker.mjs file in pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const MyPdfViewer = ({document}) => {
  const [numPages, setNumPages] = useState(null);
  const containerRef = useRef(null); // Ref for the container element

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const getPageWidth = () => {
    if (containerRef.current) {
        // Get the width of the container, but limit it to 800px
        return Math.min(containerRef.current.offsetWidth, 800);
    }
    return 800;  // default width if container is not available
};

  return (
    <div
      ref={containerRef}
      className="w-[100%] min-h-[400px] overflow-y-auto overflow-x-hidden hide-scrollbar"
    >
      <Document
        file={document}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {/* Render all pages sequentially */}
        {Array.from(new Array(numPages), (_, index) => (
          <div key={index} className="mb-1">
            <Page
              pageNumber={index + 1}
              width={getPageWidth()}
              renderTextLayer={false} // Disable text layer rendering
              renderAnnotationLayer={false} // Disable annotation layer rendering
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

export default MyPdfViewer;
