// PDF generation for student portfolio / achievement (resume-style template)
// Uses jsPDF - safe API for page dimensions and text wrapping

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

/** Get page width in pt (A4 = 595.28). Avoids doc.internal.pageSize.getWidth which may not exist. */
const getPageWidth = (doc) => {
  try {
    const p = doc.internal?.pageSize;
    if (p && typeof p.getWidth === 'function') return p.getWidth();
    if (p && typeof p.width === 'number') return p.width;
  } catch (_) {}
  return 595.28;
};

/** Draw wrapped text and return new y position. Uses splitTextToSize when available. */
const drawWrappedText = (doc, text, x, y, maxWidth, lineHeight = 14) => {
  const str = String(text || '');
  try {
    if (typeof doc.splitTextToSize === 'function') {
      const lines = doc.splitTextToSize(str, maxWidth);
      (Array.isArray(lines) ? lines : [str]).forEach((line) => {
        doc.text(line, x, y);
        y += lineHeight;
      });
      return y;
    }
  } catch (_) {}
  doc.text(str, x, y);
  return y + lineHeight;
};

/**
 * Normalize payload: accept either explicit params or a full item from backend.
 * Backend may send institutionName, facultyName, reviewedBy, approvedBy, etc.
 */
const normalizePayload = (input) => {
  if (!input || typeof input !== 'object') {
    return {
      title: '',
      type: '',
      studentName: '',
      institution: '',
      approvedBy: '',
      approvedOn: '',
      status: '',
      imageUrl: '',
    };
  }
  const item = input;
  return {
    title: item.title ?? item.description ?? '',
    type: item.type ?? '',
    studentName: item.studentName ?? item.student_name ?? '',
    institution: item.institution ?? item.institutionName ?? item.institution_name ?? '',
    approvedBy:
      item.approvedBy ??
      item.reviewedBy ??
      item.approved_by ??
      item.reviewed_by ??
      item.facultyName ??
      item.faculty_name ??
      '',
    approvedOn: item.approvedOn ?? item.reviewedOn ?? item.approved_on ?? item.reviewed_on ?? item.timestamp ?? '',
    status: item.status ?? '',
    imageUrl: item.imageUrl ?? item.certificateUrl ?? item.image_url ?? item.certificate_url ?? '',
  };
};

/**
 * Generate a portfolio-style PDF for a single achievement/certificate.
 * Layout inspired by resume: clean, black/white, clear sections.
 */
export const generateAchievementPdf = async (input) => {
  const {
    title,
    type,
    studentName,
    institution,
    approvedBy,
    approvedOn,
    status,
    imageUrl,
  } = normalizePayload(input);

  let doc;
  try {
    const JsPDF = await loadJsPdf();
    doc = new JsPDF({ unit: 'pt', format: 'a4' });
  } catch (e) {
    console.error('PDF: failed to load jsPDF', e);
    throw new Error('Could not load PDF library. Please try again.');
  }

  const pad = 50;
  const pageW = getPageWidth(doc);
  const contentWidth = pageW - pad * 2;
  let y = 50;

  // ----- Header: Student name (like resume) -----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text(studentName || 'Student Name', pad, y);
  y += 32;

  // ----- Section: CERTIFICATE / ACHIEVEMENT (centered, resume-style) -----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  const sectionTitle = (type || 'achievement').toString().toUpperCase();
  const sectionText = sectionTitle === 'CERTIFICATE' || sectionTitle === 'CERTIFICATION' ? 'CERTIFICATE' : 'ACHIEVEMENT';
  const sectionWidth = doc.getTextWidth(sectionText);
  doc.text(sectionText, (pageW - sectionWidth) / 2, y);
  y += 24;

  // Horizontal line under section heading
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(pad, y, pageW - pad, y);
  y += 22;

  // ----- Content rows (label left, value can wrap) -----
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  const lineHeight = 16;
  const labelW = 95;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.text('Title', pad, y);
  doc.setFont('helvetica', 'normal');
  y = drawWrappedText(doc, title || '—', pad + labelW, y, contentWidth - labelW, lineHeight) + 6;

  // Institution (ensure it shows; backend may send institutionName)
  doc.setFont('helvetica', 'bold');
  doc.text('Institution', pad, y);
  doc.setFont('helvetica', 'normal');
  y = drawWrappedText(doc, institution || '—', pad + labelW, y, contentWidth - labelW, lineHeight) + 6;

  // Approved By / Faculty
  doc.setFont('helvetica', 'bold');
  doc.text('Approved By', pad, y);
  doc.setFont('helvetica', 'normal');
  const approvedByDisplay = approvedBy ? `${approvedBy} (Faculty)` : '—';
  y = drawWrappedText(doc, approvedByDisplay, pad + labelW, y, contentWidth - labelW, lineHeight) + 6;

  // Date
  doc.setFont('helvetica', 'bold');
  doc.text('Date', pad, y);
  doc.setFont('helvetica', 'normal');
  const dateStr = approvedOn ? new Date(approvedOn).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
  doc.text(dateStr, pad + labelW, y);
  y += lineHeight + 6;

  // Status
  doc.setFont('helvetica', 'bold');
  doc.text('Status', pad, y);
  doc.setFont('helvetica', 'normal');
  doc.text((status || '—').toString().toUpperCase(), pad + labelW, y);
  y += 28;

  // Divider line
  doc.setDrawColor(180, 180, 180);
  doc.line(pad, y, pageW - pad, y);
  y += 24;

  // ----- Optional: certificate/achievement image -----
  try {
    const dataUrl = await fetchImageAsDataUrl(imageUrl);
    if (dataUrl) {
      const maxImgW = contentWidth;
      const maxImgH = 160;
      let imgW = maxImgW;
      let imgH = maxImgH;
      doc.addImage(dataUrl, 'JPEG', pad, y, imgW, imgH, undefined, 'FAST');
      y += imgH + 12;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('Attachment', pad, y);
      y += 16;
    }
  } catch (_) {}

  // Save with safe filename
  const safeTitle = (title || 'achievement').replace(/[^a-z0-9]+/gi, '_').toLowerCase().slice(0, 60);
  try {
    doc.save(`${safeTitle}.pdf`);
  } catch (e) {
    console.error('PDF save failed', e);
    throw new Error('Could not save PDF. Check browser download settings.');
  }
};

export default generateAchievementPdf;
