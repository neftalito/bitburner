/** @param {NS} ns **/
export async function main(ns) {
	//Ponemos la ram com un argumento a la ejecucion del script
    var ram = ns.args[0];
	//Iterador
	var i = 0;
	//Nombre del archivo
	var fileName = "server-hack.js"

	if(ram == null){
		ns.toast("Se necesita la ram como argumento","error")
		return;
	}

	while (i < ns.getPurchasedServerLimit()) {
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {

			//Ponemos el nombre del server como variable			
			var hostname = "pserv-"+i;
			
			//Si el servidor existe y la ram es menor a la que seleccionamos, borramos el servidor
			if(ns.serverExists(hostname) && ns.getServerMaxRam(hostname) < ram){
				ns.killall(hostname);
				ns.deleteServer(hostname);
			}

			//Verificamos que el servidor no exista, para no sobreescribir
			if(!ns.serverExists(hostname)){
				//Compramos el server
				ns.purchaseServer(hostname, ram);
				ns.toast(`Server purchased as ${hostname} with ${ram}GB of ram`);
				var threads = Math.floor(ram / 2.4);

				//Enviamos el virus y lo ejecutamos tantas veces como la ram lo permita
				await ns.scp(fileName, hostname);
				ns.exec(fileName, hostname, threads);
			}
			++i;
		}
		await ns.sleep(500)
	}
}