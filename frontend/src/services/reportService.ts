import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { type Reading } from '../stores/glucose';

export interface ReportData {
  title: string;
  subtitle: string;
  username: string;
  lang: string;
  avg: number | string;
  tir: number | string;
  sd?: number | string;
  gmi?: number | string;
  tirDetails?: {
    below: number;
    inRange: number;
    above: number;
    min: number;
    max: number;
  };
  quality?: {
    daysUsed: number;
    totalDays: number;
    samples: number;
    gaps: number;
    avgInterval?: number;
  };
  chartImage?: string; // Base64 image
  treatments?: {
    timestamp: string;
    text: string;
    type: string;
  }[];
}

export class ReportService {
  private doc!: jsPDF;
  private pageWidth!: number;
  private pageHeight!: number;

  constructor() {}

  private initDoc() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  private drawHeader(data: ReportData) {
    // 1. Background Header (Slate 900)
    this.doc.setFillColor(15, 23, 42); 
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');
    
    // Logo "GliceChart"
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(26);
    this.doc.text('Glice', 14, 25);
    
    const gliceWidth = this.doc.getTextWidth('Glice');
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(148, 163, 184); // Slate 400
    this.doc.text('Chart', 14 + gliceWidth, 25);
    
    // Title (Uppercase & Bold)
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(data.title.toUpperCase(), 14, 34);
    
    // User Info (Right Aligned)
    this.doc.setFontSize(9);
    this.doc.setTextColor(255, 255, 255);
    const userText = `UTENTE: ${data.username.toUpperCase()}`;
    this.doc.text(userText, this.pageWidth - 14 - this.doc.getTextWidth(userText), 20);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(148, 163, 184);
    const dateText = new Date().toLocaleString(data.lang === 'it' ? 'it-IT' : 'en-US').toUpperCase();
    this.doc.text(dateText, this.pageWidth - 14 - this.doc.getTextWidth(dateText), 28);
  }

  private drawSummaryCards(data: ReportData) {
    let currentY = 50;
    const cardWidth = (this.pageWidth - 28 - 10) / 3; // 3 cards, 5mm gap between them
    const cardHeight = 35;
    
    // Common Card Style
    const drawCard = (x: number, y: number, title: string, value: string, unit: string = '', color: [number, number, number] = [15, 23, 42]) => {
      // Card Shadow/Border effect
      this.doc.setFillColor(248, 250, 252); // Slate 50
      this.doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
      this.doc.setDrawColor(226, 232, 240); // Slate 200
      this.doc.setLineWidth(0.1);
      this.doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'S');
      
      // Title
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(7);
      this.doc.setTextColor(100, 116, 139); // Slate 500
      this.doc.text(title.toUpperCase(), x + 6, y + 10);
      
      // Value
      this.doc.setFontSize(20);
      this.doc.setTextColor(color[0], color[1], color[2]);
      this.doc.text(value, x + 6, y + 25);
      
      // Unit
      if (unit) {
        this.doc.setFontSize(8);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(148, 163, 184); // Slate 400
        const valWidth = this.doc.getTextWidth(value);
        this.doc.text(unit, x + 6 + valWidth + 2, y + 25);
      }
    };

    // 1. Media
    drawCard(14, currentY, 'Media Glicemia', `${data.avg}`, 'mg/dL');
    
    // 2. TIR
    drawCard(14 + cardWidth + 5, currentY, 'Time In Range', `${data.tir}%`, '', [34, 197, 94]);
    
    // 3. GMI or SD
    if (data.gmi) {
      const gmiValue = typeof data.gmi === 'number' ? data.gmi.toFixed(1) : data.gmi;
      drawCard(14 + (cardWidth + 5) * 2, currentY, 'Stima HbA1c', `${gmiValue}%`, '', [99, 102, 241]);
    } else {
      drawCard(14 + (cardWidth + 5) * 2, currentY, 'Variabilità', `${data.sd || '--'}`, 'SD');
    }

    return currentY + cardHeight + 15;
  }

  private drawTIRBar(data: ReportData, currentY: number) {
    if (!data.tirDetails) return currentY;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(71, 85, 105); // Slate 600
    this.doc.text('DISTRIBUZIONE TIR', 14, currentY);
    
    const targetText = `TARGET ${data.tirDetails.min}-${data.tirDetails.max} mg/dL`;
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(targetText, this.pageWidth - 14 - this.doc.getTextWidth(targetText), currentY);
    
    currentY += 4;
    const barWidth = this.pageWidth - 28;
    const barHeight = 10;
    
    // Bar container (rounded)
    this.doc.setFillColor(241, 245, 249); // Slate 100
    this.doc.roundedRect(14, currentY, barWidth, barHeight, 2, 2, 'F');
    
    let startX = 14;
    // We use a small hack to keep rounded corners on the whole bar by drawing rects inside
    // but the segments themselves don't easily have rounded corners in jsPDF without more complex logic.
    // For now, standard rects.
    
    if (data.tirDetails.below > 0) {
      this.doc.setFillColor(245, 158, 11); // Amber 500 (Warning)
      const w = (data.tirDetails.below / 100) * barWidth;
      this.doc.rect(startX, currentY, w, barHeight, 'F');
      startX += w;
    }
    if (data.tirDetails.inRange > 0) {
      this.doc.setFillColor(34, 197, 94); // Green 500 (Success)
      const w = (data.tirDetails.inRange / 100) * barWidth;
      this.doc.rect(startX, currentY, w, barHeight, 'F');
      startX += w;
    }
    if (data.tirDetails.above > 0) {
      this.doc.setFillColor(239, 68, 68); // Red 500 (Error)
      const w = (data.tirDetails.above / 100) * barWidth;
      this.doc.rect(startX, currentY, w, barHeight, 'F');
    }

    // Legend
    currentY += barHeight + 8;
    this.doc.setFontSize(7);
    this.doc.setTextColor(100, 116, 139);
    
    const drawLegendItem = (x: number, color: [number, number, number], label: string) => {
      this.doc.setFillColor(color[0], color[1], color[2]);
      this.doc.circle(x, currentY - 1, 1, 'F');
      this.doc.text(label, x + 3, currentY);
      return this.doc.getTextWidth(label) + 15;
    };

    let legendX = 14;
    legendX += drawLegendItem(legendX, [245, 158, 11], `BASSO: ${data.tirDetails.below}%`);
    legendX += drawLegendItem(legendX, [34, 197, 94], `IN RANGE: ${data.tirDetails.inRange}%`);
    legendX += drawLegendItem(legendX, [239, 68, 68], `ALTO: ${data.tirDetails.above}%`);

    return currentY + 12;
  }

  private drawQualityInfo(data: ReportData, currentY: number) {
    if (!data.quality) return currentY;

    // Quality Box
    this.doc.setFillColor(248, 250, 252);
    this.doc.roundedRect(14, currentY, this.pageWidth - 28, 15, 2, 2, 'F');
    this.doc.setDrawColor(226, 232, 240);
    this.doc.roundedRect(14, currentY, this.pageWidth - 28, 15, 2, 2, 'S');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(71, 85, 105);
    this.doc.text(`QUALITÀ DATI: ${data.quality.daysUsed} / ${data.quality.totalDays} GIORNI`, 20, currentY + 6);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text(`CAMPIONI: ${data.quality.samples} | LACUNE: ${data.quality.gaps} | INTERVALLO MEDIO: ${data.quality.avgInterval || '--'} min`, 20, currentY + 11);
    
    return currentY + 25;
  }

  private drawChart(data: ReportData, currentY: number) {
    if (!data.chartImage) return currentY;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.doc.setTextColor(15, 23, 42);
    this.doc.text('GRAFICO MEDIO DEL PERIODO', 14, currentY);

    const imgWidth = this.pageWidth - 28;
    const imgHeight = 70;
    
    // Chart container
    this.doc.setFillColor(255, 255, 255);
    this.doc.setDrawColor(241, 245, 249);
    this.doc.roundedRect(14, currentY + 4, imgWidth, imgHeight + 4, 2, 2, 'F');
    this.doc.roundedRect(14, currentY + 4, imgWidth, imgHeight + 4, 2, 2, 'S');
    
    this.doc.addImage(data.chartImage, 'PNG', 14 + 2, currentY + 6, imgWidth - 4, imgHeight);

    return currentY + imgHeight + 20;
  }

  private drawTreatmentsTable(data: ReportData, currentY: number) {
    if (!data.treatments || data.treatments.length === 0) return currentY;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.doc.setTextColor(15, 23, 42);
    this.doc.text('DETTAGLIO TRATTAMENTI', 14, currentY);
    
    const treatmentData = data.treatments.map(t => [
      t.timestamp,
      t.type.toUpperCase(),
      t.text.toUpperCase()
    ]);

    autoTable(this.doc, {
      startY: currentY + 4,
      head: [['ORARIO', 'TIPO', 'DESCRIZIONE']],
      body: treatmentData,
      theme: 'grid',
      headStyles: { 
        fillColor: [15, 23, 42], // Slate 900
        textColor: [255, 255, 255],
        fontSize: 7,
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: { 
        fontSize: 7,
        cellPadding: 3,
        font: 'helvetica'
      },
      columnStyles: {
        0: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 'auto' }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // Slate 50
      },
      margin: { left: 14, right: 14 }
    });

    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  public generateReport(data: ReportData, filename: string) {
    this.initDoc();
    this.drawHeader(data);
    let currentY = this.drawSummaryCards(data);
    currentY = this.drawTIRBar(data, currentY);
    currentY = this.drawQualityInfo(data, currentY);
    currentY = this.drawChart(data, currentY);
    this.drawTreatmentsTable(data, currentY);

    // Footer
    const pageCount = this.doc.internal.getNumberOfPages();
    this.doc.setFontSize(8);
    this.doc.setTextColor(148, 163, 184);
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.text(`GliceChart - Page ${i} of ${pageCount}`, this.pageWidth / 2, this.pageHeight - 10, { align: 'center' });
    }

    this.doc.save(filename);
  }
}

export const reportService = new ReportService();
