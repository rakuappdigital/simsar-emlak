import { formatTL } from "./economy";

export interface ShareCardData {
  soldCount: number;
  totalEarned: number;
  balance: number;
  reputation: string;
  rank: string;
  badgeCount: number;
  endingTitle: string;
  endingDescription: string;
}

const WIDTH = 720;
const HEIGHT = 960;

async function ensureFonts() {
  try {
    await Promise.all([
      document.fonts.load('28px "Press Start 2P"'),
      document.fonts.load('16px "Press Start 2P"'),
      document.fonts.load('32px "VT323"'),
    ]);
  } catch {
    // fonts unavailable — canvas falls back to the generic monospace below
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Draws the same house+keyhole mark as LogoIcon/favicon, using plain canvas rects. */
function drawLogo(ctx: CanvasRenderingContext2D, cx: number, top: number, cell: number) {
  const gold = "#ffd166";
  const dark = "#0d0d1a";
  const originX = cx - 12 * cell;
  const rect = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(originX + x * cell, top + y * cell, w * cell, h * cell);
  };
  rect(10, 2, 4, 2, gold);
  rect(7, 4, 10, 2, gold);
  rect(4, 6, 16, 2, gold);
  rect(5, 8, 14, 10, gold);
  rect(7, 10, 3, 3, dark);
  rect(14, 10, 3, 3, dark);
  rect(10, 12, 4, 6, dark);
  rect(11, 13, 2, 2, gold);
  rect(11, 15, 2, 2, gold);
}

export async function generateShareCard(data: ShareCardData): Promise<string> {
  await ensureFonts();

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 2d context unavailable");

  // Background
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Border frame
  ctx.strokeStyle = "#ffd166";
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, WIDTH - 36, HEIGHT - 36);

  // Logo
  drawLogo(ctx, WIDTH / 2, 50, 6);

  // Title
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffd166";
  ctx.font = '32px "Press Start 2P", monospace';
  ctx.fillText("SİMSAR EMLAK", WIDTH / 2, 230);

  ctx.font = '20px "VT323", monospace';
  ctx.fillStyle = "#aaaaaa";
  ctx.fillText("Bugünün Özeti", WIDTH / 2, 262);

  // Stat card
  const cardX = 60;
  const cardY = 300;
  const cardW = WIDTH - 120;
  const cardH = 300;
  ctx.fillStyle = "#14142b";
  ctx.strokeStyle = "#444444";
  ctx.lineWidth = 2;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  const rows: [string, string][] = [
    ["Satılan Ev", String(data.soldCount)],
    ["Toplam Kazanç", formatTL(data.totalEarned)],
    ["Bakiye", formatTL(data.balance)],
    ["Ün", data.reputation || "—"],
    ["Kariyer Rütbesi", data.rank],
    ["Rozet Sayısı", String(data.badgeCount)],
  ];

  ctx.font = '22px "VT323", monospace';
  ctx.textBaseline = "middle";
  const rowH = cardH / rows.length;
  rows.forEach(([label, value], i) => {
    const y = cardY + rowH * i + rowH / 2;
    ctx.textAlign = "left";
    ctx.fillStyle = "#999999";
    ctx.fillText(label, cardX + 24, y);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffd166";
    ctx.fillText(value, cardX + cardW - 24, y);
    if (i < rows.length - 1) {
      ctx.strokeStyle = "#2a2a4a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cardX + 12, cardY + rowH * (i + 1));
      ctx.lineTo(cardX + cardW - 12, cardY + rowH * (i + 1));
      ctx.stroke();
    }
  });

  // Ending card
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";
  ctx.fillStyle = "#06d6a0";
  ctx.font = '18px "Press Start 2P", monospace';
  const endingTitleLines = wrapText(ctx, data.endingTitle, cardW);
  let ey = cardY + cardH + 60;
  for (const line of endingTitleLines) {
    ctx.fillText(line, WIDTH / 2, ey);
    ey += 28;
  }

  ctx.font = '20px "VT323", monospace';
  ctx.fillStyle = "#f0f0f0";
  const descLines = wrapText(ctx, data.endingDescription, cardW - 40);
  ey += 12;
  for (const line of descLines) {
    ctx.fillText(line, WIDTH / 2, ey);
    ey += 26;
  }

  // Footer
  ctx.font = '14px "VT323", monospace';
  ctx.fillStyle = "#888888";
  ctx.fillText("Simsar Emlak — İstanbul'un en yaratıcı emlakçısı", WIDTH / 2, HEIGHT - 40);

  return canvas.toDataURL("image/png");
}
