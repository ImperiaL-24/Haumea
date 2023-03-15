
export let ddPreprocess = {
	script:({ content, attributes, filename }) => {
		if (attributes.lang !== 'ts') return;
		const dds = content.match(/\$\$:.+(\n|;)/g);
		if(dds == null) return;
		
		for(let dd of dds) {
			let unsubscriberName = "_DD" + Math.round(Math.random()*1000000) + "unsubscriber";
			let subscriber = dd.match(/(?<=\$\$:).+(?==>)/)[0].trim();
			let code = dd.match(/(?<==>).+/)[0].trim();
			let newCode = "";
			if(code.startsWith("let")) {
				const varName = code.match(/(?<=let ).+?(?=:|=)/)[0].trim();
				const declaration = code.match(/let.+?(?=;|=)/)[0].trim();
				newCode += declaration +";\n";
				code = code.replace(declaration,varName).trim();
			}
			newCode += `let ${unsubscriberName} = ${subscriber}.subscribe(() => ${code.replace(";","")});\nonDestroy(${unsubscriberName})\n`;
			content = content.replace(dd, newCode);
		}
		if(!content.match(/import ?{ *\w*onDestroy\w* *} ?from ?("|')svelte("|');/))content = `import { onDestroy } from "svelte";\n` + content;
		return {
			code: content
		}
	}

}
