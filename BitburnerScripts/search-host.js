function runCommand(command) {
    const terminalInput = document.getElementById("terminal-input")
    const handler = Object.keys(terminalInput)[1]
    
    terminalInput.value = command
    terminalInput[handler].onChange({target:terminalInput})
    terminalInput[handler].onKeyDown({keyCode:13,preventDefault:()=>null})
}

/** @param {NS} ns **/
export async function main(ns) {
    function getPathToServer(target) {
        var scanned = new Set
        var queue = [["home"]]

        let path
        while (queue) {
            if (!(path = queue.shift())) {
                return Error(`Could not find server ${target}`)
            }

            let server = path[path.length - 1]

            if (server == target) {
                return path.slice(1)
            }

            let scanResult = ns.scan(server).filter(s => !scanned.has(s))
            queue.push(...scanResult.map(s => [...path, s]))
            scanResult.forEach(s => scanned.add(s))
        }
    }

    runCommand(["home", ...getPathToServer(ns.args[0])].join("; connect "))
}