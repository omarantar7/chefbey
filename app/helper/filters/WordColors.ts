export interface TitlePart {
  type: "text" | "styled" | "br";
  text?: string;
}

export const parseTitle = (title?: string): string => {
  if (!title) return "";

  const escapeHtml = (str: string | any) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const parseLinks = (text: string): string => {
    let result = "";
    let lastIndex = 0;
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      result += escapeHtml(text.slice(lastIndex, match.index));
      const linkText = escapeHtml(match[1]);
      const linkUrl = escapeHtml(match[2]);
      result += `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="underline text-primary">${linkText}</a>`;
      lastIndex = regex.lastIndex;
    }

    result += escapeHtml(text.slice(lastIndex));

    return result;
  };

  const parseLine = (line: string): string => {
    let result = "";
    let lastIndex = 0;
    const regex = /`([^`]+)`/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      result += parseLinks(line.slice(lastIndex, match.index));
      result += `<span class="font-allura italic font-normal text-7xl text-primary">${escapeHtml(match[1])}</span>`;
      lastIndex = regex.lastIndex;
    }

    result += parseLinks(line.slice(lastIndex));

    return result;
  };

  return title.split("\n").map(parseLine).join("<br />");
};
