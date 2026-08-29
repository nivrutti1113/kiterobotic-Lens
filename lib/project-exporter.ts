// Project Document Exporter Engine
// Compiles Project Manuals, Bill of Materials (BOM), Circuit Wiring Tables, and C++/Python Source Code into printable PDF format.

import { ProjectTemplate } from '@/lib/projects-data';

export function triggerPrintableProjectReport(project: ProjectTemplate, customPython?: string, customCpp?: string) {
  if (typeof window === 'undefined') return;

  const pyCode = customPython || project.generatedPython;
  const cppCode = customCpp || project.generatedCpp;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate the printable ATL Project Manual PDF.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Kite Robotics ATL Project Manual - ${project.title}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #0f172a; line-height: 1.5; }
        .header { text-align: center; border-bottom: 3px solid #0284c7; padding-bottom: 15px; margin-bottom: 25px; }
        .header h1 { margin: 0; color: #0284c7; font-size: 24px; }
        .header p { margin: 5px 0 0 0; color: #64748b; font-size: 13px; font-weight: bold; }
        .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 25px; font-size: 13px; }
        .meta-item { display: flex; flex-direction: column; }
        .meta-item label { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; }
        .meta-item span { font-weight: bold; color: #0f172a; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 15px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
        th { background: #f1f5f9; color: #334155; }
        pre { background: #0f172a; color: #38bdf8; padding: 15px; border-radius: 8px; font-family: 'Courier New', Courier, monospace; font-size: 11px; overflow-x: auto; white-space: pre-wrap; }
        .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; pt: 10px; text-align: center; font-size: 11px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>KITE ROBOTICS INDIA — ATL PROJECT MANUAL</h1>
        <p>Aligned with NEP 2020 & Atal Tinkering Labs (ATL) STEM Curriculum</p>
      </div>

      <div class="meta-grid">
        <div class="meta-item"><label>Project Title</label><span>${project.title}</span></div>
        <div class="meta-item"><label>Target Grade Band</label><span>${project.targetGradeBand}</span></div>
        <div class="meta-item"><label>Difficulty Level</label><span>${project.difficulty}</span></div>
      </div>

      <div class="section">
        <div class="section-title">1. Project Overview & Objectives</div>
        <p style="font-size: 13px;">${project.description}</p>
      </div>

      <div class="section">
        <div class="section-title">2. Bill of Materials (BOM)</div>
        <table>
          <thead>
            <tr>
              <th>Item #</th>
              <th>Component Description</th>
              <th>Quantity</th>
              <th>Specifications</th>
            </tr>
          </thead>
          <tbody>
            ${project.componentsUsed.map((comp, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${comp}</strong></td>
                <td>1 Unit</td>
                <td>5V / 3.3V Standard Module</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">3. Compiled Firmware Source Code (MicroPython)</div>
        <pre>${pyCode}</pre>
      </div>

      <div class="section">
        <div class="section-title">4. Compiled Hardware Firmware (Arduino C++)</div>
        <pre>${cppCode}</pre>
      </div>

      <div class="footer">
        © 2026 Kite Robotics India | Official ATL Project Exhibition Manual | www.kiterobotics.in
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
