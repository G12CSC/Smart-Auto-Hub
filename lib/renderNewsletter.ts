import fs from "fs";
import path from "path";

export function renderNewsletterTemplate(
  title: string,
  message: string
) {
  const filePath = path.join(
    process.cwd(),
    "/templates/newsletter.html"
  );

  let html = fs.readFileSync(filePath, "utf-8");

  html = html.replace("{{title}}", title);
  html = html.replace("{{message}}", message);

  return html;
}
