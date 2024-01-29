export const balloonImageUrl = chrome.runtime.getURL("icons/icon.png");
export const stylesheetUrl = chrome.runtime.getURL("src/content/style.css");

export type Message = {
  action: string;
  balloonCount: number;
};
