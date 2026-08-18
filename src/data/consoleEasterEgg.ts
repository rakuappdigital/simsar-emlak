/** A tiny "we see you" moment for the ~1% of players who open devtools. Zero gameplay effect. */
export function printConsoleEasterEgg(): void {
  const art = `
   _____ _                          ______           _       _
  / ____(_)                        |  ____|         | |     | |
 | (___  _ _ __ ___  ___  __ _ _ __| |__   _ __ ___ | | __ _| | __
  \\___ \\| | '_ \` _ \\/ __|/ _\` | '__|  __| | '_ \` _ \\| |/ _\` | |/ /
  ____) | | | | | | \\__ \\ (_| | |  | |____| | | | | | | (_| |   <
 |_____/|_|_| |_| |_|___/\\__,_|_|  |______|_| |_| |_|_|\\__,_|_|\\_\\
`;
  console.log(`%c${art}`, "color:#ffd166;font-family:monospace;font-size:10px;");
  console.log(
    "%cMerhaba geliştirici arkadaşım 👋 Sen de mi ev satmaya çalışıyorsun, yoksa sadece meraklısın mı?",
    "color:#a78bfa;font-size:13px;font-weight:bold;",
  );
  console.log("%cBurada gizli bir şey aramana gerek yok... ya da var mı? 😉", "color:#888;font-size:11px;");
}
