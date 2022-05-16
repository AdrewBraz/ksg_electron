import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld("api", {
  getMegaData: async (channel, data) => {
    return await ipcRenderer.invoke('megaChannel')
  },
  ffomsData: async (channel, data) => {
    return await ipcRenderer.invoke(channel, data)
  },
  pdfCreation: async(channel, data) => {
    return await ipcRenderer.invoke('pdf', data)
  }
}) 