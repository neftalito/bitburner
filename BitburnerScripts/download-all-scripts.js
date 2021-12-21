/** @param {NS} ns **/
export async function main(ns) {
    var files = ns.ls("home",".js");
	var command = "";
	for(let i = 0; i<files.length;i++){
		command += `download ${files[i]};`
	}
	ns.tprint(command);
}