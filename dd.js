//TODO: MULTI LINE CODE
export let ddPreprocess = {
	script:({ content, attributes, filename }) => {
		if (attributes.lang !== 'ts') return;
		const dds = content.match(/\$\$:.+(\n|;)/g);
		if(dds == null) return;
		
		for(let dd of dds) {
			const ddName = "_DD" + Math.round(Math.random()*1000000);
			const unsubscriberName = ddName + "unsubscriber";
			const ddFunctionName = ddName + "code";
			const ddResubberName = ddName + "resubscriber";
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
			newCode += `let ${ddFunctionName} = () => {${code}}\n let ${unsubscriberName} = ${signalName}.subscribe(${ddFunctionName});\nonDestroy(() => {${unsubscriberName}();})\n`;
			if(signal.startsWith("$:")) {
				newCode+=`let ${ddResubberName} = () => {if(${unsubscriberName}) ${unsubscriberName}(); ${unsubscriberName} = ${signalName}.subscribe(${ddFunctionName});} 
				$: ${signalName} && ${ddResubberName}()`
			}
			content = content.replace(dd, newCode);
		}
		if(!content.match(/import ?{ *\w*onDestroy\w* *} ?from ?("|')svelte("|');/))content = `import { onDestroy } from "svelte";\n` + content;
		return {
			code: content
		}
	}

}
