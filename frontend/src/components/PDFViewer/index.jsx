import { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from "./styles.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PDFViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const wrapperRef = useRef(null);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Document file={url} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        {Array.from({ length: numPages }, (_, i) => (
          <Page
            key={i + 1}
            pageNumber={i + 1}
            width={wrapperRef.current?.clientWidth ?? 600}
          />
        ))}
      </Document>
    </div>
  );
}