// Lightweight PDF generation using jsPDF via CDN UMD loader

const loadJsPdf = async () => {
  if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-jspdf]');
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-jspdf', 'true');
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return window.jspdf.jsPDF;
};

const fetchImageAsDataUrl = async (url) => {
  if (!url) return null;
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return null;
  }
};

export const generateAchievementPdf = async ({
  title,
  type,
  studentName,
  institution,
  approvedBy,
  approvedOn,
  status,
  imageUrl,
}) => {
  const JsPDF = await loadJsPdf();
  const doc = new JsPDF({ unit: 'pt', format: 'a4' });

  const pad = 40;
  let y = pad;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Achievement Record', pad, y);
  y += 28;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const lines = [
    [`Title`, title || '-'],
    [`Type`, (type || '-').toString().toUpperCase()],
    [`Student`, studentName || '-'],
    [`Institution`, institution || '-'],
    [`Status`, (status || '-').toString().toUpperCase()],
    [`Approved By`, approvedBy || '-'],
    [`Approved On`, approvedOn ? new Date(approvedOn).toLocaleString() : '-'],
  ];

  const labelWidth = 110;
  lines.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, pad, y);
    doc.setFont('helvetica', 'normal');
    const text = Array.isArray(value) ? value.join(', ') : String(value);
    doc.text(text, pad + labelWidth, y, { maxWidth: 500 });
    y += 20;
  });

  y += 10;
  doc.setDrawColor(50, 100, 200);
  doc.line(pad, y, doc.internal.pageSize.getWidth() - pad, y);
  y += 20;

  // Add image if available
  try {
    const dataUrl = await fetchImageAsDataUrl(imageUrl);
    if (dataUrl) {
      const maxWidth = doc.internal.pageSize.getWidth() - pad * 2;
      const imgWidth = maxWidth;
      const imgHeight = (maxWidth * 9) / 16; // approximate
      doc.addImage(dataUrl, 'JPEG', pad, y, imgWidth, imgHeight, undefined, 'FAST');
      y += imgHeight + 10;
      doc.setFont('helvetica', 'italic');
      doc.text('Attachment preview', pad, y);
    }
  } catch {}

  const safeTitle = (title || 'achievement').replace(/[^a-z0-9]+/gi, '_').toLowerCase();
  doc.save(`${safeTitle}.pdf`);
};

export default generateAchievementPdf;


