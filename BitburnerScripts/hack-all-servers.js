/** @param {NS} ns **/
export async function main(ns) {
    var files = ["kill-all-server-scripts.js","open-ports.js","hack-servers-v2.js","hack-pserv.js"]
	for(let i = 0; i < files.length; i++){
		ns.run(files[i])
	}
}