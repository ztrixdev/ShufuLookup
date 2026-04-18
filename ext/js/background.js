chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sflu",
    title: "Find in ShufuLookup",
    contexts: ["selection"]
  })
})

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "sflu") {
    chrome.storage.local.set({ lastQuery: info.selectionText })
    chrome.action.openPopup() 
  }
})