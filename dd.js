
export let ddPreprocess = {
	script:({ content, attributes, filename }) => {
		if (attributes.lang !== 'ts') return;
		const dds = content.match(/\$\$:.+(\n|;)/g);
		if(dds == null) return;
		
		for(let dd of dds) {
			const ddName = "_DD" + Math.round(Math.random()*1000000);
			const unsubscriberName = ddName + "unsubscriber";
			const signal = dd.match(/(?<=\$\$:).+(?==>)/)[0].trim();
			let signalName = signal.match(/(?<=\$:).+/); 
			signalName ? signalName = signalName[0].trim() : signalName = signal;
			let code = dd.match(/(?<==>).+/)[0].trim();

			let newCode = "";
			if(code.startsWith("let")) {
				const varName = code.match(/(?<=let ).+?(?=:|=)/)[0].trim();
				const declaration = code.match(/let.+?(?=;|=)/)[0].trim();
				newCode += declaration +";\n";
				code = code.replace(declaration,varName).trim();
			}
			newCode += `let ${unsubscriberName} = ${signalName}.subscribe(() => ${code.replace(";","")});\nonDestroy(${unsubscriberName})\n`;
			if(signal.startsWith("$:")) {
				newCode+=`$:{${unsubscriberName}(); ${unsubscriberName} = ${signalName}.subscribe(() => ${code.replace(";","")});}`
			}
			content = content.replace(dd, newCode);
		}
		if(!content.match(/import ?{ *\w*onDestroy\w* *} ?from ?("|')svelte("|');/))content = `import { onDestroy } from "svelte";\n` + content;
		console.log(content);
		return {
			code: content
		}
	}

}
