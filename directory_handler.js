const directorySelectButton = document.querySelector('.directorySelect')

const directorySelectWindow = (function() {
    const window = document.createElement('div')
    window.className = 'window'

    const windowHeader = document.createElement('p')
    windowHeader.textContent = 'Select File'
    window.appendChild(windowHeader)
    
    const entriesWrapper = document.createElement('div')
    entriesWrapper.className = 'entriesWrapper'
    window.appendChild(entriesWrapper)

    const newDirButton = document.createElement('div')
    newDirButton.className = 'windowButton'
    newDirButton.textContent = '+'
    newDirButton.addEventListener('click', event => {
        save.newDir().then(response => {
            makeFileRequest('/filelist').then(response => {
                while(entriesWrapper.firstChild) entriesWrapper.removeChild(entriesWrapper.firstChild)
                JSON.parse(response.data).forEach(file => createEntry(file))
            })
        })
    })
    window.appendChild(newDirButton)
    return window
})()
const entriesWrapper = directorySelectWindow.querySelector('.entriesWrapper')

directorySelectButton.addEventListener('click', () => openDirectorySelect())

let _bold
function closeWindow(event) {
    if(event.target != directorySelectWindow &&
        !directorySelectWindow.contains(event.target) &&
        !event.target != contextMenus.pane &&
        !contextMenus.pane.contains(event.target)) {
        document.body.removeChild(directorySelectWindow)
        while(entriesWrapper.firstChild) entriesWrapper.removeChild(entriesWrapper.firstChild)
        removeEventListener('mousedown', closeWindow)
    }
}
function openDirectorySelect(bold = false) {
    _bold = bold
    if(!bold) addEventListener('mousedown', closeWindow)
    directorySelectWindow.style.zIndex = bold ? 7 : 5
    document.body.appendChild(directorySelectWindow)
    refreshEntries()
}

let disabled = false
const screen = (function() {
    const block = document.createElement('div')
    block.className = 'block'
    function disableScreen(loading = true) {
        if(loading) {
            block.style.cursor = 'wait'
            disabled = true
        }
        else block.style.cursor = 'default'
        document.body.appendChild(block)
    }
    function enableScreen() {
        document.body.removeChild(block)
        disabled = false
    }
    return { enable: enableScreen, disable: disableScreen }
})()


function createEntry(file) {
    const entry = document.createElement('div')
        entry.className = 'fileOption'
        entry.textContent = file.replace(/_/g, ' ')
        entry.addEventListener('click', event => {
            if(_bold) addEventListener('mousedown', closeWindow)
            if(!disabled) {
                screen.disable()
                unload()
                if(load('file/' + file) !== errors.PARSE_ISSUE) {
                    directorySelectButton.textContent = file.replace(/_/g, ' ')
                    mainDirectory = 'file/' + file
                }
            }
        })
        entry.addEventListener('mousedown', event => {
            if(event.which == 3 && !disabled) {
                contextMenus.open(4, [
                    () => {
    
                    },
                    () => {
                        contextMenus.close()
                        save.duplicateDir(file).then(refreshEntries)
                    },
                    () => {
                        makeFileRequest('/filelist').then(response => {
                            const list = JSON.parse(response.data)
                            if(list.length > 1) {
                                contextMenus.close()
                                save.deleteDir(file).then(refreshEntries)
                                if(mainDirectory == 'file/' + file) {
                                    const newFile = (list[0] == file ? list[1] : list[0])
                                    mainDirectory = 'file/' + newFile
                                    unload()
                                    load(mainDirectory)
                                    directorySelectButton.textContent = newFile.replace(/_/g, ' ')
                                }
                            }
                        })
                    }
                ], event, pane => {
                    const e0 = pane.querySelector('.e0')
                    e0.addEventListener('click', event => {
                        inputify(e0, newName => {
                            if(mainDirectory.endsWith(file)) {
                                mainDirectory = 'file/' + newName.replace(/ /g, '_')
                                directorySelectButton.textContent = newName
                            }
                            save.renameDir(file, newName.replace(/ /g, '_'))
                            entry.textContent = newName
                            file = newName.replace(/ /g, '_')
                        })
                    })
                })
            }
        })
        entriesWrapper.appendChild(entry)
}

function refreshEntries() {
    makeFileRequest('/filelist').then(response => {
        while(entriesWrapper.firstChild) entriesWrapper.removeChild(entriesWrapper.firstChild)
        JSON.parse(response.data).forEach(file => createEntry(file))
    })
}