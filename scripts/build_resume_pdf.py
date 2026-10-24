from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, KeepTogether
import re

source = Path("resume.md")
out = Path("public/resume.pdf")
out.parent.mkdir(parents=True, exist_ok=True)
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="ResumeName", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=20, leading=23, textColor=colors.HexColor("#0f172a"), alignment=TA_CENTER, spaceAfter=3))
styles.add(ParagraphStyle(name="ResumeRole", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=colors.HexColor("#036b82"), alignment=TA_CENTER, spaceAfter=4))
styles.add(ParagraphStyle(name="ResumeContact", parent=styles["Normal"], fontSize=8, leading=10, textColor=colors.HexColor("#475569"), alignment=TA_CENTER, spaceAfter=7))
styles.add(ParagraphStyle(name="ResumeH2", parent=styles["Heading2"], fontSize=11, leading=13, textColor=colors.HexColor("#036b82"), spaceBefore=7, spaceAfter=3, keepWithNext=True))
styles.add(ParagraphStyle(name="ResumeH3", parent=styles["Heading3"], fontSize=9, leading=11, textColor=colors.HexColor("#172033"), spaceBefore=4, spaceAfter=2, keepWithNext=True))
styles.add(ParagraphStyle(name="ResumeBody", parent=styles["BodyText"], fontSize=8.2, leading=10.3, textColor=colors.HexColor("#263449"), spaceAfter=2))
styles.add(ParagraphStyle(name="ResumeBullet", parent=styles["BodyText"], fontSize=8.1, leading=10, leftIndent=11, firstLineIndent=-7, bulletIndent=0, textColor=colors.HexColor("#263449"), spaceAfter=1.5))
def inline(text):
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(https?://[^\s]+)", r'<font color="#036b82">\1</font>', text)
    return text

story = []
for raw in source.read_text(encoding="utf-8").splitlines():
    line = raw.strip()
    if not line:
        story.append(Spacer(1, 1.5*mm))
    elif line.startswith("# "):
        story.append(Paragraph(inline(line[2:]), styles["ResumeName"]))
    elif line.startswith("**") and line.endswith("**") and "·" in line:
        story.append(Paragraph(inline(line), styles["ResumeRole"]))
    elif line.startswith("## "):
        story.extend([Spacer(1, 1*mm), Paragraph(inline(line[3:]), styles["ResumeH2"]), HRFlowable(width="100%", thickness=.45, color=colors.HexColor("#cbd5e1"), spaceAfter=2)])
    elif line.startswith("### "):
        story.append(Paragraph(inline(line[4:]), styles["ResumeH3"]))
    elif line.startswith("- "):
        story.append(Paragraph("• " + inline(line[2:]), styles["ResumeBullet"]))
    else:
        story.append(Paragraph(inline(line), styles["ResumeContact"] if "jeevanragula@gmail.com" in line else styles["ResumeBody"]))

doc = SimpleDocTemplate(str(out), pagesize=A4, rightMargin=15*mm, leftMargin=15*mm, topMargin=12*mm, bottomMargin=12*mm, title="Jeevan Reddy Ragula — Resume", author="Jeevan Reddy Ragula")
doc.build(story)
